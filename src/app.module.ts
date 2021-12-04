import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CitiesController } from './cities/cities.controller';
import { CitiesService } from './cities/cities.service';
import { CitiesModule } from './cities/cities.module';
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CitiesModule,
    MongooseModule.forRoot(process.env.MONGODB_URI)
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
