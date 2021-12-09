import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { CitiesModule } from './cities/cities.module';
import { WeatherModule } from './weather/weather.module';
import { SampleService } from './sample/sample.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    ScheduleModule.forRoot(),
    HttpModule,
    CitiesModule,
    WeatherModule
  ],
  controllers: [AppController],
  providers: [AppService, SampleService],
})
export class AppModule { }
