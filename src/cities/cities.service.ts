import { Injectable } from '@nestjs/common';
import { cityObj } from './entities/city.entity';

@Injectable()
export class CitiesService {
    private cities: cityObj[] = [
        {
            id: 1,
            name: "tehran"
        }
    ]

    findAll() {
        return this.cities;
    }

    findOne(id: number) {
        return this.cities.find(item => item.id === +id);
    }

    findOneByName(name: string) {
        return this.cities.find(item => item.name === name);
    }
    
    create(createCityDto: any) {
        this.cities.push(createCityDto);
    }

    remove(id: number) {
        const cityIndex = this.cities.findIndex(item => item.id === +id);
        if (cityIndex >= 0) {
            this.cities.splice(cityIndex, 1);
        }
    }
}
