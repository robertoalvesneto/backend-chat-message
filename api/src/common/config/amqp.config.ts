import { RabbitMQConfig } from '@golevelup/nestjs-rabbitmq';

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
