import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';

import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '../../common/exception';
import { UserEntity } from '../../user/user.entity';
import { BcryptUtil } from '../crypto/bcrypt.util';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email', passwordField: 'password' });
  }

  async validate(email: string, password: string): Promise<UserEntity> {
    if (!password) {
      throw new BadRequestException('비밀번호 입력되지 않음');
    }

    const user = await this.authService.findEmailAndPasswordByEmail(email);
    if (!user) {
      throw new NotFoundException('존재하지 않는 사용자');
    }

    const bcryptUtil = new BcryptUtil(); // DI 대신 직접 생성 유지
    const isMatched = await bcryptUtil.compare(password, user.password);
    if (!isMatched) {
      throw new UnauthorizedException('비밀번호가 같지 않음');
    }

    return user;
  }
}
