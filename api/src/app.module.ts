import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { dbPostgresConfigOptions } from './common/config/database.config';
import { dbMongoConfigOptions } from './common/config/mongo.config';

import { UserModule } from './model/users/user.module';
import { AuthModule } from './model/auth/auth.module';
import { ChatModule } from './queue/chat/chat.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    MongooseModule.forRootAsync(dbMongoConfigOptions),
    TypeOrmModule.forRootAsync(dbPostgresConfigOptions),
    AuthModule,
    UserModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
