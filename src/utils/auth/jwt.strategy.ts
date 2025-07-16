import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InternalServerErrorException, UnauthorizedException } from '../../common/exception';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from '../../common/types/jwt-payload.interface';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../../auth/auth.service';
import { UserEntity } from '../../user/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET_KEY');

    if (!jwtSecret) {
      throw new InternalServerErrorException('JWT_SECRET_KEY is not defined in environment variables');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: JwtPayload): Promise<UserEntity> {
    if (!payload) {
      throw new UnauthorizedException();
    }

    if (!payload.email) {
      throw new UnauthorizedException();
    }

    const user = await this.authService.findUserByEmail(payload.email);
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
