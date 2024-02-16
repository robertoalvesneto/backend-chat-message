import { RabbitMQConfig } from '@golevelup/nestjs-rabbitmq';

import { readFileSync } from 'fs';

export const AMQPSModulesOptions: RabbitMQConfig = {
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
      key: readFileSync('/usr/share/certs/api/privkey1.pem'),
      cert: readFileSync('/usr/share/certs/api/fullchain1.pem'),
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
