import { BaseException } from './BaseException';

export class NotFoundException extends BaseException {
  constructor(message: string | object = 'Not Found') {
    super(404, message);
  }
}
