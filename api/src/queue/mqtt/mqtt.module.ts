import { Module } from '@nestjs/common';

import { MQTTModuleOptions } from '../../common/config/rabbitmq.config';

import { MqttService } from './mqtt.service';

@Module({
  providers: [MQTTModuleOptions, MqttService],
  exports: [MQTTModuleOptions, MqttService],
})
export class MqttModule {}
