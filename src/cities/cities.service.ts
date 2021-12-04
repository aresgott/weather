import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotFoundError } from 'rxjs';
import { CityObj } from './entities/city.entity';

@Injectable()
export class CitiesService {
    constructor(
        @InjectModel(CityObj.name) private readonly cityModel: Model<CityObj>,
    ) { }


    findAll() {
        return this.cityModel.find().exec();
    }

    async findOne(id: string) {
        const city = await this.cityModel.findOne({ _id: id }).exec();
        if (!city) {
            throw new NotFoundException("City Not Found!");
        }
        return city;

    }

    async findOneByName(name: string) {
        const city = await this.cityModel.findOne({ name: name }).exec();
        if (!city) {
            throw new NotFoundException("City Not Found!");
        }
        return city;
    }

    create(createCityDto: any) {
        const city = new this.cityModel(createCityDto);
        return city.save();
    }

    async remove(id: string) {
        const city = await this.findOne(id);
        return city.remove();
    }
}
