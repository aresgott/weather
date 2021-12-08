import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WeatherObj } from 'src/weather/entities/weather.entity';
import { WeatherService } from 'src/weather/weather.service';
import { AddedCityDto } from './dto/create-city.dto';
import { ListCityDto } from './dto/list-city.dto';
import { RemoveCityDto } from './dto/remove-city.dto';
import { SingleCityDto } from './dto/single-city.dto';
import { CityObj } from './entities/city.entity';

@Injectable()
export class CitiesService {
    constructor(
        @InjectModel(CityObj.name) private readonly cityModel: Model<CityObj>,
        private readonly weather: WeatherService
    ) { }

    weatherCityJoin = (limitNumber: number) => {
        return [{
            $addFields: {
                "_id": {
                    "$toString": "$_id"
                }
            }
        },
        {
            "$lookup": {
                "from": "weatherobjs",
                "localField": "_id",
                "foreignField": "cityIdF",
                "as": "result",

            }
        },
        {
            $unwind: "$result"
        },
        {
            "$sort": {
                "result.timestamp": -1,

            }
        },
        {
            $group: {
                _id: "$_id",
                weathers: {
                    $push: {
                        "cityName": "$name",
                        "weather": "$result"
                    },

                }
            },

        },
        {
            "$project": {
                "weathers": {
                    "$slice": [
                        "$weathers",
                        limitNumber
                    ]
                },

            }
        }

        ]
    }
    async getDataFromApi(): Promise<ListCityDto> {
        let cities = await this.cityModel.find({}).exec();
        let weather:any = [];
        for (const iterator of cities) {
            const cityName = iterator.name;
            const id = iterator._id;
            let tmpResultWeather = await this.weather.getDataWeather(cityName);
            weather.push({ id: id, name: cityName, weather: tmpResultWeather })
        }
        let responseData: ListCityDto = {
            hasError: false,
            count: cities.length,
            result: weather.map((weatherItem) => ({
                id: weatherItem.id,
                name: weatherItem.name,
                weather: {
                    wind: weatherItem.weather.wind,
                    main: weatherItem.weather.main,
                    weather: weatherItem.weather.weather,
                    coord: weatherItem.weather.coord
                }
            }))
        }
        return responseData

    }
    async findAll(): Promise<ListCityDto> {

        const listCities: any = await this.cityModel.aggregate(
            this.weatherCityJoin(1)
        );
        let responseData: ListCityDto = {
            hasError: false,
            count: listCities.length,
            result: listCities.map(({ _id, weathers }) => ({
                id: _id,
                name: weathers[0].cityName,
                weather: {
                    wind: weathers[0].weather.wind,
                    main: weathers[0].weather.main,
                    weather: weathers[0].weather.weather,
                    coord: weathers[0].weather.coord
                }
            })),
        }
        return responseData
    }

    async findOne(id: string): Promise<SingleCityDto> {
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            const city = await this.cityModel.findOne({ _id: id }).exec();
            if (!city) {
                throw new NotFoundException("City Not Found!");
            }
            const response: SingleCityDto = {
                id: city.id,
                name: city.name
            }
            return response;
        } else {
            throw new BadRequestException("Bad Id structure");
        }
    }

    async findOneByName(name: string): Promise<SingleCityDto> {
        const city = await this.cityModel.findOne({ name: name }).exec();
        if (!city) {
            // throw new NotFoundException("City Not Found!");
            return null;
        }
        const response: SingleCityDto = {
            id: city.id,
            name: city.name
        }
        return response;
    }

    async create(createCityDto: any) {
        let isCityExist = await this.findOneByName(createCityDto.name);
        let resultWeather: any = await this.weather.getDataWeather(createCityDto.name);
        let responseCreate: AddedCityDto;
        if (!isCityExist && resultWeather.status == 200) {
            createCityDto.coord = resultWeather.coord;
            createCityDto.cityId = resultWeather.cityId;

            const city = new this.cityModel(createCityDto);
            const resultSave = await city.save();

            await this.weather.addWeatherData(resultWeather, createCityDto.name, String(resultSave._id));

            responseCreate = {
                hasError: false,
                message: [`${resultSave.name} city added to database`],
                weatherService: resultWeather
            }
            return responseCreate;

        } else {
            const errors = [];

            if (resultWeather.status == 404) errors.push("there is no city for getting weather/weather service");
            if (isCityExist) errors.push("we have this city");

            responseCreate = {
                hasError: true,
                message: errors,
            }
            throw new HttpException(responseCreate, isCityExist ? HttpStatus.CONFLICT : HttpStatus.NOT_FOUND);

        }

    }

    async remove(id: string): Promise<RemoveCityDto> {
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            const city = await this.cityModel.findOne({ _id: id }).exec();
            let response: RemoveCityDto;
            if (!city) {
                response = {
                    hasError: false,
                    message: "city not found."
                }
            } else {
                const resultRemove = await city.remove();

                // const city = await this.cityModel.findOne({ _id: id }).exec();
                // console.log(resultRemove)
                if (!resultRemove) {
                    response = {
                        hasError: false,
                        message: "city not deleted."
                    }
                } else {
                    await this.weather.removeAllWeather(id)

                    response = {
                        hasError: false,
                        message: "city and weather data deleted.",
                        result: {
                            id: resultRemove.id,
                            name: resultRemove.name
                        }
                    }
                }
            }

            return response
        } else {
            throw new BadRequestException("Bad Id structure");

        }
    }
}
