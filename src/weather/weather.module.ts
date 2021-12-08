import { HttpModule, HttpService } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CitiesModule } from 'src/cities/cities.module';
import { HttpRequestService } from 'src/http-request/http-request.service';
import { WeatherObj, WeatherSchema } from './entities/weather.entity';
import { WeatherService } from './weather.service';

@Module({
    imports: [    
        HttpModule
    ],
    providers: [HttpRequestService]
})

export class WeatherModule { }
