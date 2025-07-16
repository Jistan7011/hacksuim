import { BaseException } from './BaseException';

export class ForbiddenException extends BaseException {
  constructor() {
    super(403, 'Forbidden');
  }
}
