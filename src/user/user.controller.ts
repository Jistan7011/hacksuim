import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../utils/auth/jwt-auth.guard';

import { UserService } from './user.service';
import { ReqEmpInfoDto } from './dto/req/req.emp-info.dto';
import { ResEmpInfoDto } from './dto/res/res.emp-info.dto';
import { ResMyinfoDto } from './dto/res/res.myinfo.dto';
import { Response } from 'express';
import { ResDownloadDto } from '../file/dto/res/res.download.dto';
import { ReqEmpInfoFileDto } from './dto/req/req.emp-info-file.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('myinfo')
  @ApiOperation({ summary: '현재 사용자 정보 조회' })
  @ApiResponse({ status: 200, description: '사용자 정보 조회 성공', type: ResEmpInfoDto })
  @ApiResponse({ status: 404, description: '사용자 정보 조회 실패' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  async getCurrentUserInfo(@Req() req): Promise<ResMyinfoDto> {
    return await this.userService.findUserByEmail(req.user.email);
  }

  @Get('emp-info')
  @ApiOperation({ summary: '임직원 정보 조회' })
  @ApiResponse({ status: 200, description: '임직원 정보 조회 성공', type: ResEmpInfoDto, isArray: true })
  @ApiResponse({ status: 404, description: '임직원 정보 조회 실패' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @ApiQuery({
    name: 'sortKey',
    description: '',
    required: false,
    type: 'string',
  })
  @ApiQuery({
    name: 'sorting',
    description: '',
    required: false,
    type: 'string',
  })
  @ApiQuery({
    name: 'limit',
    description: '',
    required: false,
    type: 'string',
  })
  async getEmployeeInfo(@Query() query: ReqEmpInfoDto): Promise<ResEmpInfoDto[]> {
    return await this.userService.allUsers(query.sortKey, query.sorting, query.limit);
  }

  @Get('emp-info/download')
  @ApiOperation({ summary: '임직원 정보 다운로드' })
  @ApiResponse({ status: 200, description: '임직원 정보 조회 성공', type: ResDownloadDto })
  @ApiResponse({ status: 404, description: '임직원 정보 조회 실패' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @ApiQuery({
    name: 'sortKey',
    description: '',
    required: false,
    type: 'string',
  })
  @ApiQuery({
    name: 'sorting',
    description: '',
    required: false,
    type: 'string',
  })
  @ApiQuery({
    name: 'limit',
    description: '',
    required: false,
    type: 'string',
  })
  async getEmployeeInfoDownload(@Query() query: ReqEmpInfoFileDto, @Res() res: Response) {
    const buffer = await this.userService.employeesDownloadCsv(query.sortKey, query.sorting, query.limit, query.originFilename);

    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename=${query.originFilename ?? 'employees.csv'}`,
    });

    buffer.pipe(res);
  }
}
