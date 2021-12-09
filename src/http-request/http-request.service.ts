import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { WeatherObj } from '../weather/entities/weather.entity';

@Injectable()
export class HttpRequestService {
  private readonly logger = new Logger(WeatherObj.name);

  constructor(private httpService: HttpService) { }

  async HttpRequest({ method, url, data, headers }): Promise<{ status: number; data: any }> {
    try {
      const axios = this.httpService.request({
        method: method,
        url,
        headers,
        data,
        maxRedirects: 3,
        timeout: Number(process.env.TIMEOUT_REQUEST),
        timeoutErrorMessage: "timeout"
      });
      const res = await firstValueFrom(axios);
      return {
        status: res.status,
        data: res.data,
      };
    } catch (e) {
      this.logger.error(JSON.stringify({
        status: e.response
          ? e.response.status
          : HttpStatus.INTERNAL_SERVER_ERROR,
        data: e.response ? e.response.data : '',
      }))
      return {
        status: e.response
          ? e.response.status
          : HttpStatus.INTERNAL_SERVER_ERROR,
        data: e.response ? e.response.data : '',
      };
    }
  }
}
