import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { WeatherService } from 'src/weather/weather.service';

@Injectable()
export class JobrunnerService {

    constructor(private weather: WeatherService, private schedulerRegistry: SchedulerRegistry) {
        const job = new CronJob(`${process.env.JOB_WEATHER_FETCH}`, () => {
            console.log(`time  for job  to run!`)

            // get city
            // open weather
            // save weathers

            //fail jobs
        });

        schedulerRegistry.addCronJob("salam",job);
        // job.start()
        
    }

}
