import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CitiesService } from './cities.service';
import { AddedCityDto, CreateCityDto } from './dto/create-city.dto';
import { ListCityDto } from './dto/list-city.dto';
import { SingleCityDto } from './dto/single-city.dto';

@ApiTags("City")
@Controller('cities')
export class CitiesController {
    constructor(private readonly citiesService: CitiesService) { }


    //Should return a list of all cities 
    // Should include the latest weather data for that city (as stored in the database)
    @Get()
    @ApiOperation({ summary: 'this api should use bulk but bulk service for open api is not free!' })
    async findAllCities(): Promise<ListCityDto> {
        return this.citiesService.getDataFromApi()
    }

    @Get('/weather')
    async getAllCityAndLastResult(): Promise<ListCityDto> {
        return this.citiesService.findAll()
    }


    // Should return the last known weather data for the city given by name (not id)
    @ApiNotFoundResponse({ description: 'Not found city' })
    @Get(':id')
    findOneCityWeather(@Param('id') id: string): Promise<SingleCityDto> {
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
    async create(@Body() createCityDto: CreateCityDto): Promise<AddedCityDto> {
        const result = await this.citiesService.create(createCityDto)
        return result;
    }


    // Should delete the city and its weather data from the database
    @Delete(':id')
    removeCity(@Param('id') id: string) {
        return this.citiesService.remove(id);
    }



}
