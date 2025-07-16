import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { QueryFailedError, Repository } from 'typeorm';

import { RedisService } from '../redis/redis.service';

import { ReqSignupDto } from './dto/req/req.signup.dto';
import { ReqSigninDto } from './dto/req/req.signin.dto';

import { UserEntity } from '../user/user.entity';

import { BcryptUtil } from '../utils/crypto/bcrypt.util';
import { BadRequestException, NotFoundException } from '../common/exception';
import { JwtPayload } from '../common/types/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly redisService: RedisService,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async register(userDTO: ReqSignupDto): Promise<{ message: string }> {
    let message = '회원가입 성공';

    try {
      const { password, ...rest } = userDTO;

      const bcryptUtil = new BcryptUtil();
      const hashedPassword = await bcryptUtil.hash(password);

      const user = this.userRepository.create({
        email: userDTO.email,
        name: userDTO.name,
        phone_number: userDTO.phoneNumber,
        birthday: userDTO.birthday,
        position: userDTO.position,
        department: userDTO.department,
        password: hashedPassword,
        role: 'level_3',
      });

      await this.userRepository.createQueryBuilder().insert().into(UserEntity).values(user).execute();

      return { message: message };
    } catch (error) {
      message = '회원가입 실패';

      if (error instanceof QueryFailedError) {
        const driverError = (error as any).driverError;
        const code = driverError.code;

        if (code === 'ER_DUP_ENTRY') {
          message = '중복된 이메일 또는 전화번호';
        }
      } else {
        // ...
      }

      throw new BadRequestException(message);
    }
  }

  async login(userDTO: ReqSigninDto): Promise<{ message: string; accessToken: string }> {
    const user: UserEntity | null = await this.findUserByEmail(userDTO.email);

    if (!user) {
      throw new NotFoundException('사용자 정보 없음');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const accessToken: string = await this.jwtService.signAsync(payload, {
      expiresIn: '1h',
    });

    // 중복 로그인 방지
    const oldToken: string | null = await this.redisService.get(`access-${user.email}`);
    if (oldToken) {
      const oldPayload: JwtPayload = this.jwtService.decode(oldToken);
      const expireTTL: number = oldPayload.exp - Math.floor(Date.now() / 1000);

      await this.redisService.set(`blacklist-${oldToken}`, user.email, expireTTL);
      await this.redisService.del(`access-${user.email}`);
    }
    await this.redisService.set(`access-${user.email}`, accessToken, 60 * 60);

    return { message: '로그인 성공', accessToken: accessToken };
  }

  async logout(user: JwtPayload): Promise<{ message: string }> {
    try {
      const oldToken = await this.redisService.get(`access-${user.email}`);

      if (oldToken) {
        const payload: JwtPayload = this.jwtService.decode(oldToken);
        const expireTTL = payload.exp - Math.floor(Date.now() / 1000);

        if (expireTTL > Date.now()) {
          await this.redisService.set(`blacklist-${oldToken}`, user.email, expireTTL);
        }
        await this.redisService.del(`access-${user.email}`);
      }

      return { message: '로그아웃 성공' };
    } catch (error) {
      console.error(`[LOGOUT] - ${error}`);
      throw new BadRequestException('로그아웃 실패');
    }
  }

  async findUserByEmail(email: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({
      where: { email },
      select: ['email', 'name', 'role'],
    });
  }

  async findEmailAndPasswordByEmail(email: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({
      where: { email },
      select: ['email', 'password'],
    });
  }
}
