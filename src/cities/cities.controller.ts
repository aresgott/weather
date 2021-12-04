import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, NotFoundException, Param, Post, Query, Res } from '@nestjs/common';
import { ApiNotFoundResponse, ApiProperty, ApiTags } from '@nestjs/swagger';
import { response } from 'express';
import { CitiesService } from './cities.service';
import { CreateCityDto } from './dto/create-city.dto';
import { CityObj } from './entities/city.entity';

@ApiTags("City")
@Controller('cities')
export class CitiesController {
    constructor(private readonly citiesService: CitiesService) { }


    //Should return a list of all cities 
    // Should include the latest weather data for that city (as stored in the database)
    @Get()
    findAllCities() {
        // let { limit } = pagination;
        // response.status(400).send("salam be hame" + limit);
        return this.citiesService.findAll()
    }


    // Should return the last known weather data for the city given by name (not id)
    @ApiNotFoundResponse({ description: 'Not found city' })
    @Get(':id')
    findOneCityWeather(@Param('id') id: string) {
        return this.citiesService.findOne(id);
    }

    // Should return the last known weather data for the city given by name (not id)
    @Get(':name/weather')
    cityWeatherByName(@Param('name') name: string) {
        return this.citiesService.findOneByName(name);
    }


    // Should create a new city and retrieve the current temperature and other basic weather data for that city
    // Should return 409 Conflict when the city already exists
    @Post()
    create(@Body() createCityDto: CreateCityDto) {
        return this.citiesService.create(createCityDto)
    }


    // Should delete the city and its weather data from the database
    @Delete(':id')
    removeCity(@Param('id') id: string) {
        return this.citiesService.remove(id);
    }



}
