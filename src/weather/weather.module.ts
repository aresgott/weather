import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { HttpRequestService } from 'src/http-request/http-request.service';

@Module({
    imports: [    
        HttpModule
    ],
    providers: [HttpRequestService]
})

export class WeatherModule { }
