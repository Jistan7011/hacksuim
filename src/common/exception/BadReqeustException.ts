import { BaseException } from './BaseException';

export class BadRequestException extends BaseException {
  constructor(message: string | object = 'Bad Request') {
    super(400, message);
  }
}
