import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class HttpRequestService {

  constructor(private httpService: HttpService) { }

  async HttpRequest({ method, url, data, headers }): Promise<{ status: number; data: any }> {
    try {
      const axios = this.httpService.request({
        method: method,
        url,
        headers,
        data,
        maxRedirects: 3,
        timeout:Number(process.env.TIMEOUT_REQUEST),
        timeoutErrorMessage:"timeout"
      });
      const res = await firstValueFrom(axios);
      return {
        status: res.status,
        data: res.data,
      };
    } catch (e) {
      // console.log(e)
      return {
        status: e.response
          ? e.response.status
          : HttpStatus.INTERNAL_SERVER_ERROR,
        data: e.response ? e.response.data : '',
      };
    }
  }
}
