import { HttpException } from '@nestjs/common';

export class BaseException extends HttpException {
  constructor(status: number, message: string | object) {
    super(message, status);
  }
}
