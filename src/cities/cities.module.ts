import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpRequestService } from '../http-request/http-request.service';
import { JobrunnerService } from '../job-runner/job-runner.service';
import { WeatherForcastObj, WeatherForcastSchema } from '../weather/entities/weather-forcast.entity';
import { WeatherObj, WeatherSchema } from '../weather/entities/weather.entity';
import { WeatherService } from '../weather/weather.service';
import { CitiesController } from './cities.controller';
import { CitiesService } from './cities.service';
import { CityObj, CitySchema } from './entities/city.entity';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: CityObj.name,
                schema: CitySchema
            },
            {
                name: WeatherObj.name,
                schema: WeatherSchema
            },
            {
                name: WeatherForcastObj.name,
                schema: WeatherForcastSchema
            }
        ]),
        HttpModule
    ],
    controllers: [CitiesController],
    providers: [CitiesService, HttpRequestService, WeatherService,JobrunnerService]
})
export class CitiesModule { }
