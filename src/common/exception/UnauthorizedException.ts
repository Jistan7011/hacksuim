import { BaseException } from './BaseException';

export class UnauthorizedException extends BaseException {
  constructor(message: string | object = 'Unauthorized') {
    super(401, message);
  }
}
