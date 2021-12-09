import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpRequestService } from 'src/http-request/http-request.service';
import { JobrunnerService } from 'src/job-runner/job-runner.service';
import { WeatherForcastObj, WeatherForcastSchema } from 'src/weather/entities/weather-forcast.entity';
import { WeatherObj, WeatherSchema } from 'src/weather/entities/weather.entity';
import { WeatherModule } from 'src/weather/weather.module';
import { WeatherService } from 'src/weather/weather.service';
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
    providers: [CitiesService, HttpRequestService, JobrunnerService, WeatherService]
})
export class CitiesModule { }
