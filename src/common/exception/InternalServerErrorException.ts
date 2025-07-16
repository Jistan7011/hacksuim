import { BaseException } from './BaseException';

export class InternalServerErrorException extends BaseException {
  constructor(message: string | object = 'Inter Server Error') {
    super(500, message);
  }
}
