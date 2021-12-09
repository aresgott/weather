import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiTags('Welcome Page')
  @ApiOperation({ summary: 'Hi :) Welcome to Weather assessment.' })
  getHello(): string {
    return this.appService.getHello();
  }
}
