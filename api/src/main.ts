import { NestFactory, Reflector } from '@nestjs/core';
import { MqttOptions } from '@nestjs/microservices';

import { AppModule } from './app.module';
import { microserviceOptions } from './common/config/rabbitmq.config';
import { httpsOptions } from './common/config/http.config';
import { ClassSerializerInterceptor } from '@nestjs/common';

function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { httpsOptions });

  app.connectMicroservice<MqttOptions>(microserviceOptions);

  app.enableCors();

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.useGlobalGuards();

  await app.listen(3000);

  await sleep(200);

  console.log(
    '  _____ ____ _   _  ___    __  __ _____ ____ ____    _    ____ _____ ____  \n' +
      ' | ____/ ___| | | |/ _ \\  |  \\/  | ____/ ___/ ___|  / \\  / ___| ____|  _ \\ \n' +
      ' |  _|| |   | |_| | | | | | |\\/| |  _| \\___ \\___ \\ / _ \\| |  _|  _| | |_) |\n' +
      ' | |__| |___|  _  | |_| | | |  | | |___ ___) |__) / ___ \\ |_| | |___|  _ < \n' +
      ' |_____\\____|_| |_|\\___/  |_|  |_|_____|____/____/_/   \\_\\____|_____|_| \\_\\\n' +
      '                                                                          ',
  );
}
bootstrap();
