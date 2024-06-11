import * as net from 'net';
import type TAedes from 'aedes';
import * as Aedes from 'aedes';

// @ts-expect-error - Aedes is a function
const aedes: TAedes = Aedes();

class MqttBrokerAdapter {
  private server: net.Server;

  constructor() {
    if (!process.env.MQTT_PORT) {
      throw new Error('MQTT_PORT env is not defined');
    }
    this.server = net.createServer(aedes.handle);
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
    aedes.on('client', function (client) {
      console.log(
        'Client Connected: \x1b[33m' +
          (client ? client.id : client) +
          '\x1b[0m',
        'to broker',
        aedes.id,
      );
    });

    // fired when a client disconnects
    aedes.on('clientDisconnect', function (client) {
      console.log(
        'Client Disconnected: \x1b[31m' +
          (client ? client.id : client) +
          '\x1b[0m',
        'to broker',
        aedes.id,
      );
    });
    aedes.on('ack', function (client) {
      console.log(client);
    });

    // fired when a message is published
    aedes.on('publish', async function (packet) {
      console.log(packet.payload.toString());
    });
  }
}

export default MqttBrokerAdapter;
