import { Controller, Get } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get()
  // @ApiTags('Welcome Page')
  // getHello(): string {
  //   return this.appService.getHello();
  // }
}
