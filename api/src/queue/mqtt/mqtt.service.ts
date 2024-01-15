import { ClientProxy, MqttRecordBuilder } from '@nestjs/microservices';
import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class MqttService {
  constructor(@Inject('API_v1') private readonly client: ClientProxy) {}

  public publish(
    topic: string,
    message: object,
    setQoS: 0 | 1 | 2 | undefined,
  ): void {
    const userProperties = { 'x-version': '1.0.0' };
    const record = new MqttRecordBuilder(message)
      .setProperties({ userProperties })
      .setQoS(setQoS)
      .build();
    this.client.emit<object>(topic, record);
  }
}
