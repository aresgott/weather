import { Model } from 'mongoose';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { WeatherObj } from './entities/weather.entity';
import { weatherDto, weatherResponseDto } from 'src/weather/dto/weather.dto';
import { HttpRequestService } from 'src/http-request/http-request.service';

@Injectable()
export class WeatherService {
    constructor(
        @InjectModel(WeatherObj.name) private weather: Model<WeatherObj>,
        private httpService: HttpRequestService
    ) { }

    async getDataWeather(city: string) {

        let weatherResponse: any = await this.httpService.HttpRequest({
            method: 'get',
            url: `${process.env.WEATHER_API_ROUTE}/weather?q=${city}&appid=${process.env.API_KEY}`,
            data: {},
            headers: {}
        });
        if (weatherResponse.status == 200) {
            const response: weatherResponseDto = {
                status: weatherResponse.status,
                cityId: weatherResponse.data.id,
                coord: weatherResponse.data.coord,
                weather: weatherResponse.data.weather,
                main: weatherResponse.data.main,
                wind: weatherResponse.data.wind,
            }
            return response
        } else {
            throw new InternalServerErrorException("weather server error");
        }


    }

    async removeAllWeather(cityId: string) {
        let removed = await this.weather.remove({ cityIdF: cityId });
    }

    async addWeatherData(weatherData, cityName, cityId) {

        const weatherDataSave: weatherDto = {
            cityIdF: cityId,
            timestamp: new Date().getTime(),
            coord: weatherData.coord,
            weather: weatherData.weather,
            main: weatherData.main,
            wind: weatherData.wind,
        }
        const weatherObj = new this.weather(weatherDataSave)
        const resultSave = await weatherObj.save();
        console.log(resultSave)
    }
}
