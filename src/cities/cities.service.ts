import { BadRequestException, HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WeatherService } from '../weather/weather.service';
import { AddedCityDto } from './dto/create-city.dto';
import { ListCityDto, ListCityWithoutForcastDto } from './dto/list-city.dto';
import { RemoveCityDto } from './dto/remove-city.dto';
import { SingleCityDto } from './dto/single-city.dto';
import { CityObj } from './entities/city.entity';

@Injectable()
export class CitiesService {
    private readonly logger = new Logger(CitiesService.name);
    constructor(
        @InjectModel(CityObj.name) private readonly cityModel: Model<CityObj>,
        private readonly weather: WeatherService
    ) {

    }

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
        },
        {
            "$lookup": {
                "from": "weatherforcastobjs",
                "localField": "_id",
                "foreignField": "cityIdF",
                "as": "forcast",
            }
        }

        ]
    }
    weatherCityWeatherJoinHelper = (cityName: string, limitNumber: number) => {
        return [
            { $match: { name: cityName } },
            {
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
            },
            {
                "$lookup": {
                    "from": "weatherforcastobjs",
                    "localField": "_id",
                    "foreignField": "cityIdF",
                    "as": "forcast",
                }
            }

        ]
    }
    async getDataFromApi(): Promise<ListCityWithoutForcastDto> {
        let cities = await this.cityModel.find({}).exec();
        let weather: any = [];
        //better way is use bulk, open weather has a premium one!
        for (const iterator of cities) {
            const cityName = iterator.name;
            const id = iterator._id;
            let tmpResultWeather = await this.weather.getDataWeather(cityName);
            weather.push({ id: id, name: cityName, weather: tmpResultWeather })
        }
        let responseData: ListCityWithoutForcastDto = {
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
                },
                forcast:listCities[0].forcast
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
            return null;
        }
        const response: SingleCityDto = {
            id: city.id,
            name: city.name
        }
        return response;
    }
    async findOneByNameAndWeather(name: string) {
        const listCities: any = await this.cityModel.aggregate(
            this.weatherCityWeatherJoinHelper(name, 1)
        );
        let responseData: ListCityDto
        if (listCities.length > 0) {
            let forcast: any;
            let coord = listCities[0].weathers[0]?.weather.coord;
            if (listCities[0]?.forcast.length == 0) {
                forcast = await this.weather.getDataWeatherForcast(coord.lat, coord.lon);
                this.weather.addWeatherForcastData(forcast, listCities[0]._id)
            } else {
                forcast = listCities[0].forcast[0]?.weathers;
            }
            responseData = {
                hasError: false,
                count: listCities.length,
                result: listCities.map(({ _id, weathers }) => ({
                    id: _id,
                    name: weathers[0]?.cityName,
                    weather: {
                        wind: weathers[0]?.weather.wind,
                        main: weathers[0]?.weather.main,
                        weather: weathers[0]?.weather.weather,
                        coord: weathers[0]?.weather.coord
                    },
                    forcast: forcast
                }))
            }
        } else {
            let tmpResultWeather = await this.weather.getDataWeather(name);
            let tmpForcastWeather = await this.weather.getDataWeatherForcast(tmpResultWeather.coord.lat, tmpResultWeather.coord.lon)
            if (tmpResultWeather.status == 200) {
                responseData = {
                    hasError: false,
                    count: 1,
                    result: [
                        {
                            name: name,
                            weather: {
                                cityId: tmpResultWeather.cityId,
                                coord: tmpResultWeather.coord,
                                weather: tmpResultWeather.weather,
                                main: tmpResultWeather.main,
                                wind: tmpResultWeather.wind
                            },
                            forcast: tmpForcastWeather

                        }
                    ]
                }
            } else {
                this.logger.warn("City Not Found in weather service")
                throw new NotFoundException("City Not Found in weather service");
            }

        }

        return responseData

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

            await this.weather.addWeatherData(resultWeather, String(resultSave._id));
            responseCreate = {
                hasError: false,
                message: [`${resultSave.name} city added to database`],
                weather: resultWeather
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

    async getAllCity() {
        return await this.cityModel.find({}).exec();
    }
}
