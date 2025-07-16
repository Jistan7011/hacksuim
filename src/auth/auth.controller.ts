import { Controller, Req, Res, Get, Post, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { plainToInstance } from 'class-transformer';

import { AuthService } from './auth.service';

import { ReqSignupDto } from './dto/req/req.signup.dto';
import { ReqSigninDto } from './dto/req/req.signin.dto';
import { ResSignupDto } from './dto/res/res.signup.dto';
import { ResSigninDto } from './dto/res/res.signin.dto';

import { JwtAuthGuard } from '../utils/auth/jwt-auth.guard';
import { ResLogoutDto } from './dto/res/res.logout.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '회원가입' })
  @ApiResponse({
    status: 201,
    description: '회원가입 성공',
    type: ResSignupDto,
  })
  @ApiResponse({ status: 400, description: '회원가입 실패' })
  async registerUser(@Body() reqSignupDto: ReqSignupDto): Promise<ResSignupDto> {
    const queryState = await this.authService.register(reqSignupDto);

    return { message: queryState.message };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '로그인' })
  @ApiResponse({
    status: 200,
    description: '로그인 성공',
    type: ResSigninDto,
  })
  @ApiResponse({ status: 404, description: '로그인 실패' })
  async login(@Body() reqSigninDto: ReqSigninDto, @Res() res: Response) {
    const queryState = await this.authService.login(reqSigninDto);
    const dto = plainToInstance(ResSigninDto, { message: queryState.message });

    res.setHeader('Authorization', `Bearer ${queryState.accessToken}`);
    return res.status(200).json(dto);
  }

  @Get('logout')
  @ApiOperation({ summary: '로그아웃' })
  @ApiResponse({
    status: 200,
    description: '로그아웃 성공',
    type: ResLogoutDto,
  })
  @ApiResponse({ status: 404, description: '로그아웃 실패' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req): Promise<ResLogoutDto> {
    const queryState = await this.authService.logout(req.user);

    return { message: queryState.message };
  }
}
