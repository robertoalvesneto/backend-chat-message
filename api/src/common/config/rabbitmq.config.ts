import {
  ClientProxy,
  ClientProxyFactory,
  MqttOptions,
  Transport,
} from '@nestjs/microservices';

export const microserviceOptions: MqttOptions = {
  transport: Transport.MQTT,
  options: {
    url: process.env['RABBIT_URL'],
    userProperties: { 'x-version': '1.0.0' },
  },
};

export const MQTTModuleOptions = {
  provide: 'API_v1',
  useFactory: (): ClientProxy => ClientProxyFactory.create(microserviceOptions),
};
