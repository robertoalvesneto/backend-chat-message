import { RabbitMQConfig } from '@golevelup/nestjs-rabbitmq';

import { readFileSync } from 'fs';

export const AMQPModulesOptions: RabbitMQConfig = {
  exchanges: [
    {
      name: 'exchange1',
      type: 'topic',
    },
    {
      name: 'amq.topic',
      type: 'topic',
    },
  ],
  uri: process.env['AMQP_URL'] as string,
  connectionInitOptions: { wait: false },
  enableControllerDiscovery: true,
  connectionManagerOptions: {
    connectionOptions: {
      ca: readFileSync('/usr/share/certs/ca_with_public_keys.crt'),
      key: readFileSync('/usr/share/certs/api/ca.key'),
      cert: readFileSync('/usr/share/certs/api/ca.crt'),
      rejectUnauthorized: false,
    },
  },
  channels: {
    'channel-1': {
      prefetchCount: 15,
      default: true,
    },
    'channel-2': {
      prefetchCount: 2,
    },
  },
};
