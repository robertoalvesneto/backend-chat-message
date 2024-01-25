import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PublicProp } from './common/decorator/public-rote.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @PublicProp()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
