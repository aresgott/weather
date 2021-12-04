import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CitiesController } from './cities.controller';
import { CitiesService } from './cities.service';
import { CityObj, CitySchema } from './entities/city.entity';

@Module({
    imports:[
        MongooseModule.forFeature([
            {
                name:CityObj.name,
                schema:CitySchema
            }
        ])
    ] ,
    controllers:[CitiesController],providers:[CitiesService]})
export class CitiesModule {}
