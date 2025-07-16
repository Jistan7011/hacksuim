import {
  Controller,
  Get,
  Query,
  Req,
  Res,
  UseGuards,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { JwtAuthGuard } from '../utils/auth/jwt-auth.guard'
import { UserService } from './user.service'
import { ReqEmpInfoDto } from './dto/req/req.emp-info.dto'
import { ResEmpInfoDto } from './dto/res/res.emp-info.dto'
import { ResMyinfoDto } from './dto/res/res.myinfo.dto'
import { Response } from 'express'
import { ResDownloadDto } from '../file/dto/res/res.download.dto'
import { ReqEmpInfoFileDto } from './dto/req/req.emp-info-file.dto'
import { basename } from 'path'

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('myinfo')
  @ApiOperation({ summary: '현재 사용자 정보 조회' })
  @ApiResponse({ status: 200, description: '사용자 정보 조회 성공', type: ResMyinfoDto })
  @ApiResponse({ status: 404, description: '사용자 정보 조회 실패' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  async getCurrentUserInfo(@Req() req): Promise<ResMyinfoDto> {
    const user = await this.userService.findUserByEmail(req.user.email)
    if (!user || !user.id) {
      // Service가 사용자 없음에도 200을 반환하지 않도록 404 처리
      throw new NotFoundException('사용자 정보 조회 실패')
    }
    return user
  }

  @Get('emp-info')
  @ApiOperation({ summary: '임직원 정보 조회' })
  @ApiResponse({
    status: 200,
    description: '임직원 정보 조회 성공',
    type: ResEmpInfoDto,
    isArray: true,
  })
  @ApiResponse({ status: 404, description: '임직원 정보 조회 실패' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'sortKey', required: false, type: 'string' })
  @ApiQuery({ name: 'sorting', required: false, type: 'string' })
  @ApiQuery({ name: 'limit', required: false, type: 'string' })
  async getEmployeeInfo(@Query() query: ReqEmpInfoDto): Promise<ResEmpInfoDto[]> {
    return await this.userService.allUsers(query.sortKey, query.sorting, query.limit)
  }

  @Get('emp-info/download')
  @ApiOperation({ summary: '임직원 정보 다운로드' })
  @ApiResponse({ status: 200, description: '다운로드 준비 완료', type: ResDownloadDto })
  @ApiResponse({ status: 404, description: '임직원 정보 조회 실패' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'sortKey', required: false, type: 'string' })
  @ApiQuery({ name: 'sorting', required: false, type: 'string' })
  @ApiQuery({ name: 'limit', required: false, type: 'string' })
  @ApiQuery({ name: 'originFilename', required: false, type: 'string' })
  async getEmployeeInfoDownload(
    @Query() query: ReqEmpInfoFileDto,
    @Res() res: Response,
  ) {
    const { sortKey, sorting, limit, originFilename } = query

    // limit 검증: 숫자가 아니면 400 에러
    if (limit && isNaN(Number(limit))) {
      throw new BadRequestException('limit must be a number')
    }

    // 파일명 안전화: basename 취하고, CRLF 및 허용되지 않는 문자 제거
    const raw = originFilename ?? 'employees.csv'
    let filename = basename(raw).replace(/[\r\n]/g, '')
    if (!/^[\w.\-]+$/.test(filename)) {
      filename = 'employees.csv'
    }

    // 서비스에 sanitized filename 전달
    const stream = await this.userService.employeesDownloadCsv(
      sortKey,
      sorting,
      limit,
      filename,
    )

    // Content-Disposition 헤더에 큰따옴표로 감싸 안전하게 설정
    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${filename}"`,
    })

    stream.pipe(res)
  }
}
