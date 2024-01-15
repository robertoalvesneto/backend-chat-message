import {
  ClientProxy,
  ClientProxyFactory,
  MqttOptions,
  Transport,
} from '@nestjs/microservices';

import { readFileSync } from 'fs';

export const microserviceOptions: MqttOptions = {
  transport: Transport.MQTT,
  options: {
    url: process.env['RABBIT_URL'],
    userProperties: { 'x-version': '1.0.0' },
    ca: readFileSync('/usr/share/certs/ca_with_public_keys.crt'),
    key: readFileSync('/usr/share/certs/api/ca.key'),
    cert: readFileSync('/usr/share/certs/api/ca.crt'),
    rejectUnauthorized: false,
  },
};

export const MQTTModuleOptions = {
  provide: 'API_v1',
  useFactory: (): ClientProxy => ClientProxyFactory.create(microserviceOptions),
};
