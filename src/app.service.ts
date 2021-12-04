import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello Coffee IT! This is Mohsen\'s Assessment :)';
  }
}
