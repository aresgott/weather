import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { CitiesService } from 'src/cities/cities.service';
import { WeatherService } from 'src/weather/weather.service';

@Injectable()
export class JobrunnerService {

    constructor(private city: CitiesService, private weather: WeatherService, private schedulerRegistry: SchedulerRegistry) {
        const job = new CronJob(`${process.env.JOB_WEATHER_FETCH}`, async () => {
            console.log(`time  for job  to run!`)
            let FailurJob = [];
            // get city
            const listCity = await this.city.getAllCity();

            //better way is use bulk, open weather has a premium one!
            for (const iterator of listCity) {
                const cityName = iterator.name;
                const id = iterator._id;
                try {
                    let tmpResultWeather = await this.weather.getDataWeather(cityName);
                    // // save weathers
                    await this.weather.addWeatherData(tmpResultWeather, id);
                    let tmpForcastWeather = await this.weather.getDataWeatherForcast(iterator.coord.lat, iterator.coord.lon)
                    this.weather.addWeatherForcastData(tmpForcastWeather,id)
                    // console.log(tmpForcastWeather)
                } catch (error) {
                    FailurJob.push(cityName);
                }
            }

            // console.log(FailurJob)



            //fail jobs
        });

        schedulerRegistry.addCronJob("WeatherGettingJob", job);

        process.env.ENABLE_JOB == 'true' ? job.start() : job.stop();

    }

}
