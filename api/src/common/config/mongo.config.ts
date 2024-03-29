import { ConfigModule, ConfigService } from '@nestjs/config';

export const dbMongoConfigOptions= {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    uri: configService.get<string>('MONGODB_URL'),
  }),
  inject: [ConfigService],
}