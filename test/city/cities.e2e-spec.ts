import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CreateCityDto } from '../../src/cities/dto/create-city.dto';
import { AppModule } from '../../src/app.module';
import { MongooseModule } from '@nestjs/mongoose';

describe('Cities Api\'s (e2e)', () => {
    let app: INestApplication;
    const city = {
        name: 'ahvaz'
    }
    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                AppModule,
                MongooseModule.forRoot(process.env.MONGODB_URI),
            ]
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });
   
        it('Create City [POST]', () => {
            return request(app.getHttpServer())
                .post('/cities')
                .send(city as CreateCityDto)
                .expect(HttpStatus.CREATED)
        });

        it('Duplicate Data on Create City [POST]', () => {
            return request(app.getHttpServer())
                .post('/cities')
                .send(city as CreateCityDto)
                .expect(HttpStatus.CONFLICT)
        });

});
