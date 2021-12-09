import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { CitiesService } from '../cities/cities.service';
import { WeatherService } from '../weather/weather.service';

@Injectable()
export class JobrunnerService {
    private readonly logger = new Logger('Job');

    constructor(
        private city: CitiesService, private weather: WeatherService,
        private schedulerRegistry: SchedulerRegistry
    ) {
        const job = new CronJob(`${process.env.JOB_WEATHER_FETCH}`, async () => {

            this.logger.warn('Time for job to run!');

            let FailurJob = [];
            // get city
            const listCity = await this.city.getAllCity();

            //better way is use bulk, open weather has a premium one!
            for (const iterator of listCity) {
                const cityName = iterator.name;
                const id = iterator._id;
                try {
                    let tmpResultWeather = await this.weather.getDataWeather(cityName);
                    // save weathers
                    await this.weather.addWeatherData(tmpResultWeather, id);
                    let tmpForcastWeather = await this.weather.getDataWeatherForcast(iterator.coord.lat, iterator.coord.lon)
                    this.weather.addWeatherForcastData(tmpForcastWeather, id)
                } catch (error) {
                    this.logger.error('Fail one Job: cityName : '+cityName);
                    FailurJob.push(cityName);
                }
            }

            //fail jobs
        });

        schedulerRegistry.addCronJob("WeatherGettingJob", job);

        process.env.ENABLE_JOB == 'true' ? job.start() : job.stop();

    }

}
