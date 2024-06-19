import * as net from 'net';
import * as http from 'http';
import type TAedes from 'aedes';
import * as Aedes from 'aedes';
import { PrismaClient, TreatLevel, ValueType } from '@prisma/client';
import * as wsStream from 'websocket-stream';
import { UpdateDeviceValueResponse } from 'types/exported';

type Topics = 'clientDevicesData' | 'actuators/data' | 'sensors/data';
type TopicData<T extends Topics> = T extends 'clientDevicesData'
  ? UpdateDeviceValueResponse['updatedValue']
  : Record<string, string | number | boolean>;

// @ts-expect-error - Aedes is a function
const aedes: TAedes = Aedes();
const prisma = new PrismaClient();

class MqttBrokerAdapter {
  private server: net.Server;
  private httpServer: http.Server;

  constructor() {
    if (!process.env.MQTT_PORT) {
      throw new Error('MQTT_PORT env is not defined');
    }
    this.server = net.createServer(aedes.handle);
    this.httpServer = http.createServer();
    wsStream.createServer({ server: this.httpServer }, aedes.handle as any);
  }

  sendMessage<T extends Topics>({
    payload,
    topic,
  }: {
    topic: T;
    payload: TopicData<T>;
  }) {
    return new Promise<void>((resolve, reject) => {
      const data = JSON.stringify(payload);
      aedes.publish(
        {
          topic,
          payload: data,
          cmd: 'publish',
          qos: 1,
          retain: false,
          dup: false,
          length: data.length,
        },
        (e) => {
          if (e) {
            console.error('Error publishing message:', e);
            reject(e);
          } else {
            resolve();
          }
        },
      );
    });
  }

  start() {
    this.server.listen(Number(process.env.MQTT_PORT), () => {
      console.log(
        `MQTT broker started on mqtt://localhost:${process.env.MQTT_PORT}`,
      );
    });
    this.httpServer.listen(process.env.WS_PORT, () => {
      console.log(
        `MQTT broker started on ws://localhost:${process.env.WS_PORT}`,
      );
    });
    this.server.on('error', (err) => {
      console.error('MQTT server error:', err);
    });
    // aedes.publish({ topic: 'presence', payload: 'Hello MQTT broker' });
    aedes.on('subscribe', function (subscriptions, client) {
      console.log(
        'MQTT client \x1b[32m' +
          (client ? client.id : client) +
          '\x1b[0m subscribed to topics: ' +
          subscriptions.map((s) => s.topic).join('\n'),
        'from broker',
        aedes.id,
      );
    });

    aedes.on('unsubscribe', function (subscriptions, client) {
      console.log(
        'MQTT client \x1b[32m' +
          (client ? client.id : client) +
          '\x1b[0m unsubscribed to topics: ' +
          subscriptions.join('\n'),
        'from broker',
        aedes.id,
      );
    });

    // fired when a client connects
    aedes.on('client', async (client) => {
      console.log(client.id);
      if (!client.id || !client.id.includes('esp')) {
        return;
      }
      const devices = await prisma.device.findMany({
        where: {
          clientId: client.id,
        },
        select: {
          id: true,
        },
      });
      if (devices.length === 0) {
        return await prisma.device.create({
          data: {
            clientId: client.id,
            name: 'New Device ' + client.id,
          },
        });
      }
      await prisma.device.updateMany({
        where: {
          clientId: client.id,
        },
        data: {
          connected: true,
        },
      });
    });

    // fired when a client disconnects
    aedes.on('clientDisconnect', async (client) => {
      console.log('Dicsonnected', client.id);
      await prisma.device.updateMany({
        where: {
          clientId: client.id,
        },
        data: {
          connected: false,
        },
      });
    });
    aedes.on('ack', function (client) {
      console.log(client);
    });

    // fired when a message is published
    aedes.on('publish', async function (packet, client) {
      const topic = packet.topic.toString();
      if (topic === 'sensors/data' || topic === 'actuators/data') {
        let jsonParse: Record<string, string | number | boolean> = {};
        try {
          jsonParse = JSON.parse(packet.payload.toString()) as Record<
            string,
            string | number | boolean
          >;
        } catch (e) {
          console.error('Error parsing JSON:', e);
          return;
        }
        const allKeys = Object.keys(jsonParse);
        const devices = await prisma.device.findMany({
          where: {
            clientId: client.id,
          },
          select: {
            id: true,
            DeviceValueSetup: {
              select: {
                id: true,
                key: true,
                valueType: true,
                DeviceValue: {
                  orderBy: {
                    createdAt: 'desc',
                  },
                  take: 1,
                  select: {
                    id: true,
                  },
                },
              },
            },
          },
        });

        const dataToPublish: UpdateDeviceValueResponse['updatedValue'][] = [];
        if (!devices) {
          return;
        }
        const transactions = devices?.reduce((all, device) => {
          const deviceValueSetup = device.DeviceValueSetup;
          allKeys.forEach((key) => {
            const setup = deviceValueSetup.find((v) => v.key === key);
            if (!setup) {
              return;
              // return all.push(
              //   prisma.deviceValueSetup.create({
              //     data: {
              //       key,
              //       valueType: (typeof jsonParse[
              //         key
              //       ]).toUpperCase() as ValueType,
              //       displayName: 'Sensor',
              //       Device: {
              //         connect: {
              //           id: device.id,
              //         },
              //       },
              //       DeviceValue: {
              //         create: {
              //           value,
              //           treatLevel: TreatLevel.INFO,
              //           deviceId: device.id,
              //         },
              //       },
              //     },
              //   }),
              // );
            }
            const value =
              typeof jsonParse[key] === 'number'
                ? (
                    Math.round((jsonParse[key] as number) * 100) / 100
                  ).toString()
                : !jsonParse[key]
                  ? setup?.valueType === ValueType.NUMBER
                    ? '0'
                    : 'false'
                  : jsonParse[key].toString();
            const setupId = deviceValueSetup.find((v) => v.key === key)?.id;
            if (setupId) {
              // if (topic === 'actuators/data') {

              // } else {
              //   all.push(
              //     prisma.deviceValue.create({
              //       data: {
              //         value: jsonParse[key].toString(),
              //         DeviceValueSetup: {
              //           connect: {
              //             id: setupId,
              //           },
              //         },
              //         Device: {
              //           connect: {
              //             id: device.id,
              //           },
              //         },
              //         treatLevel: TreatLevel.INFO,
              //       },
              //     }),
              //   );
              // }
              all.push(
                prisma.deviceValue.upsert({
                  where: {
                    id:
                      deviceValueSetup.find((v) => v.key === key)
                        ?.DeviceValue[0].id || '',
                  },
                  create: {
                    value,
                    DeviceValueSetup: {
                      connect: {
                        id: setupId,
                      },
                    },
                    Device: {
                      connect: {
                        id: device.id,
                      },
                    },
                    treatLevel: TreatLevel.INFO,
                  },
                  update: {
                    value,
                    treatLevel: TreatLevel.INFO,
                  },
                }),
              );
              const payloadData: UpdateDeviceValueResponse['updatedValue'] = {
                value,
                treatLevel: TreatLevel.INFO,
                Device: {
                  id: device.id,
                },
                DeviceValueSetup: {
                  key,
                },
              };
              dataToPublish.push(payloadData);
            }
          });
          return all;
        }, []);

        const payload = JSON.stringify(dataToPublish);
        const data = {
          topic: 'clientDevicesData',
          payload,
          cmd: 'publish' as const,
          qos: 1 as const,
          retain: false,
          dup: false,
          length: payload.length,
        };
        aedes.publish(data, (e) => {
          if (e) {
            console.error('Error publishing message:', e);
          }
        });
        await prisma.$transaction(transactions);
      }
    });
  }
}

export const mqttBroker = new MqttBrokerAdapter();
