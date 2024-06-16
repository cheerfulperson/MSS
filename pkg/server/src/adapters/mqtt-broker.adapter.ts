import * as net from 'net';
import type TAedes from 'aedes';
import * as Aedes from 'aedes';
import { PrismaClient, TreatLevel, ValueType } from '@prisma/client';
import { UpdateDeviceValueResponse } from 'types/exported';

type Topics = 'client/devices/data' | 'actuators/data' | 'sensors/data';
type TopicData<T extends Topics> = T extends 'client/devices/data'
  ? UpdateDeviceValueResponse['updatedValue']
  : Record<string, string | number | boolean>;

// @ts-expect-error - Aedes is a function
const aedes: TAedes = Aedes();
const prisma = new PrismaClient();

class MqttBrokerAdapter {
  private server: net.Server;

  constructor() {
    if (!process.env.MQTT_PORT) {
      throw new Error('MQTT_PORT env is not defined');
    }
    this.server = net.createServer(aedes.handle);
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
    });

    // fired when a client disconnects
    aedes.on('clientDisconnect', async (client) => {
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
        const jsonParse = JSON.parse(packet.payload.toString()) as Record<
          string,
          string | number | boolean
        >;
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
                DeviceValue: {
                  orderBy: {
                    createdAt: 'desc',
                  },
                  take: 1,
                },
              },
            },
          },
        });

        const transactions = devices.reduce((all, device) => {
          const existedKeys = device.DeviceValueSetup.map((v) => v.key);
          const deviceValueSetup = device.DeviceValueSetup;
          allKeys.forEach((key) => {
            if (!existedKeys.includes(key)) {
              return all.push(
                prisma.deviceValueSetup.create({
                  data: {
                    key,
                    valueType: (typeof jsonParse[
                      key
                    ]).toUpperCase() as ValueType,
                    displayName: 'Sensor',
                    Device: {
                      connect: {
                        id: device.id,
                      },
                    },
                    DeviceValue: {
                      create: {
                        value: jsonParse[key].toString(),
                        treatLevel: TreatLevel.INFO,
                        deviceId: device.id,
                      },
                    },
                  },
                }),
              );
            }
            const setupId = deviceValueSetup.find((v) => v.key === key)?.id;
            if (setupId) {
              if (topic === 'actuators/data') {
                all.push(
                  prisma.deviceValue.upsert({
                    where: {
                      id:
                        deviceValueSetup.find((v) => v.key === key)
                          ?.DeviceValue[0].id || '',
                    },
                    create: {
                      value: jsonParse[key].toString(),
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
                      value: jsonParse[key].toString(),
                      treatLevel: TreatLevel.INFO,
                    },
                  }),
                );
              } else {
                all.push(
                  prisma.deviceValue.create({
                    data: {
                      value: jsonParse[key].toString(),
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
                  }),
                );
              }
              const payloadData: UpdateDeviceValueResponse['updatedValue'] = {
                value: jsonParse[key].toString(),
                treatLevel: TreatLevel.INFO,
                Device: {
                  id: device.id,
                },
                DeviceValueSetup: {
                  key,
                },
              };
              const payload = JSON.stringify(payloadData);
              const data = {
                topic: 'client/devices/data',
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
            }
          });
          return all;
        }, []);

        await prisma.$transaction(transactions);
      }
    });
  }
}

export const mqttBroker = new MqttBrokerAdapter();
