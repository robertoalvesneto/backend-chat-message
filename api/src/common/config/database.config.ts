// Npm Modules
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

import { User } from 'src/model/users/entity/user.entity';

export const dbPostgresConfigOptions: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  name: 'default',
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    url: configService.get('DATABASE_POSTGRES_URL'),
    schema: configService.get('POSTGRES_DB_SCHEMA'),
    synchronize: false,
    entities: [User],
  }),
};
