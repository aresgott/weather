import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CitiesController } from './cities/cities.controller';
import { CitiesService } from './cities/cities.service';
import { CitiesModule } from './cities/cities.module';

@Module({
  imports: [CitiesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
