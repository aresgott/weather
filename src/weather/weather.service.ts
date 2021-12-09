import { Model } from 'mongoose';
import { Injectable, InternalServerErrorException, Logger, NotFoundException, RequestTimeoutException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { WeatherObj } from './entities/weather.entity';
import { weatherDto, weatherResponseDto } from 'src/weather/dto/weather.dto';
import { HttpRequestService } from 'src/http-request/http-request.service';
import { WeatherForcastDto, WeatherSevenForcastDto } from './dto/forcast.dto';
import { WeatherForcastObj } from './entities/weather-forcast.entity';
import { NotFoundError } from 'rxjs';

@Injectable()
export class WeatherService {
    private readonly logger = new Logger(WeatherObj.name);

    constructor(
        @InjectModel(WeatherObj.name) private weather: Model<WeatherObj>,
        @InjectModel(WeatherForcastObj.name) private weatherForcast: Model<WeatherForcastObj>,
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
        } else if (weatherResponse.status == 404) {
            throw new NotFoundException("city not found in weather service");
        } else if (weatherResponse.status == 500) {
            throw new RequestTimeoutException("weather server error");
        } else {
            this.logger.warn('Weather server error');
            throw new InternalServerErrorException("weather server error");
        }


    }

    async getDataWeatherForcast(lat: number, lon: number) {

        let weatherResponse: any = await this.httpService.HttpRequest({
            method: 'get',
            url: `${process.env.WEATHER_API_ROUTE}/onecall?lat=${lat}&lon=${lon}&appid=${process.env.API_KEY}`,
            data: {},
            headers: {}
        });
        if (weatherResponse.status == 200) {
            return weatherResponse.data.daily;

            //     const response: weatherResponseDto = {
            //         status: weatherResponse.status,
            //         cityId: weatherResponse.data.id,
            //         coord: weatherResponse.data.coord,
            //         weather: weatherResponse.data.weather,
            //         main: weatherResponse.data.main,
            //         wind: weatherResponse.data.wind,
            //     }
            //     return response
            // } else if(weatherResponse.status == 500) {
            //     throw new RequestTimeoutException("weather server error");
        } else {
            throw new InternalServerErrorException("weather server error");
        }


    }

    async removeAllWeather(cityId: string) {
        await this.weather.deleteMany({ cityIdF: cityId });
        await this.weatherForcast.deleteMany({ cityIdF: cityId })
    }

    async addWeatherData(weatherData, cityId) {

        const weatherDataSave: weatherDto = {
            cityIdF: cityId,
            timestamp: new Date().getTime(),
            coord: weatherData.coord,
            weather: weatherData.weather,
            main: weatherData.main,
            wind: weatherData.wind,
        }
        const weatherObj = new this.weather(weatherDataSave)
        await weatherObj.save();
    }

    async addWeatherForcastData(weatherForcastData, cityId) {

        const weatherDataSave: WeatherForcastDto = weatherForcastData.map((weatherData) => ({
            timestamp: weatherData.dt,
            sunrise: weatherData.sunrise,
            sunset: weatherData.sunset,
            moonrise: weatherData.moonrise,
            moonset: weatherData.moonset,
            moonPhase: weatherData.moon_phase,
            temp: weatherData.temp,
            feelsLike: weatherData.feels_like,
            pressure: weatherData.pressure,
            humidity: weatherData.humidity,
            dewPoint: weatherData.dew_point,
            windSpeed: weatherData.wind_speed,
            windDeg: weatherData.wind_deg,
            windGust: weatherData.wind_gust,
            weather: weatherData.weather,
            clouds: weatherData.clouds,
            pop: weatherData.pop,
            uvi: weatherData.uvi
        }));
        const weatherForcatObj: WeatherSevenForcastDto = {
            cityIdF: cityId,
            timestamp: new Date().getTime(),
            weathers: weatherDataSave
        }
        const weatherObj = await this.weatherForcast.findOneAndUpdate({ cityIdF: cityId }, { $set: weatherForcatObj }, { new: true }).exec()
        if (!weatherObj) {
            const weatherObj = new this.weatherForcast(weatherForcatObj)
            await weatherObj.save();
        }
    }
}
