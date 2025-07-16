import { Controller, Get, Patch, Query, Body, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { BusService } from './bus.service';

import { ReqInfoDto } from './dto/req/req.info.dto';
import { ReqRouteDto } from './dto/req/req.route.dto';
import { ReqBusStopDto } from './dto/req/req.bus-stop.dto';
import { ResInfoDto } from './dto/res/res.info.dto';
import { ResRouteDto } from './dto/res/res.route.dto';
import { ResBusStopDto } from './dto/res/res.bus-stop.dto';
import { ReqInfoUpdateByBusNumberDto, ReqInfoUpdateDto } from './dto/req/req.info-update.dto';
import { ResInfoUpdateDto } from './dto/res/res.info-update.dto';
import { ResRouteCreateDto } from './dto/res/res.route-create.dto';
import { ReqRouteCreateDto, ReqRouteUpdateByBusNumberDto } from './dto/req/req.route-create.dto';
import { JwtAuthGuard } from '../utils/auth/jwt-auth.guard';

@ApiTags('Bus')
@Controller('bus')
export class BusController {
  constructor(private readonly busNumberService: BusService) {}

  @Get('info')
  @ApiOperation({ summary: 'N번 버스 정보' })
  @ApiResponse({
    status: 200,
    description: 'N번 버스 정보 조회 성공',
    type: ResInfoDto,
    isArray: true,
  })
  @ApiResponse({ status: 404, description: 'N번 버스 정보 조회 실패' })
  @ApiQuery({
    name: 'busNumber',
    description: '',
    required: false,
    type: 'string',
  })
  @ApiQuery({
    name: 'busStatus',
    description: '',
    required: true,
    type: 'string',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  async getBusInfo(@Query() query: ReqInfoDto): Promise<ResInfoDto[] | ResInfoDto> {
    if (!query.busNumber) {
      return await this.busNumberService.findAllBusInfos(query.busStatus);
    }

    return await this.busNumberService.findBusInfoByBusNumber(query.busNumber, query.busStatus);
  }

  @Get('route')
  @ApiOperation({ summary: 'N번 버스 노선' })
  @ApiResponse({ status: 200, description: 'N번 버스 노선 조회 성공', type: ResRouteDto })
  @ApiResponse({ status: 400, description: 'N번 버스 노선 조회 실패' })
  @ApiResponse({ status: 404, description: 'N번 버스 노선 조회 실패' })
  @ApiQuery({
    name: 'busNumber',
    description: '',
    required: true,
    type: 'string',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  async getBusRoute(@Query() query: ReqRouteDto): Promise<ResRouteDto> {
    return await this.busNumberService.findBusRouteByBusNumber(query.busNumber);
  }

  @Get('route/bus-stop')
  @ApiOperation({ summary: 'X 정류장을 거치는 모든 버스 정보' })
  @ApiResponse({ status: 200, description: '버스 정보 조회 성공', type: ResBusStopDto, isArray: true })
  @ApiResponse({ status: 404, description: '버스 정보 조회 실패' })
  @ApiQuery({
    name: 'busStop',
    description: '',
    required: true,
    type: 'string',
  })
  @ApiQuery({
    name: 'limit',
    description: '',
    required: true,
    type: 'string',
  })
  @ApiQuery({
    name: 'sorting',
    description: '',
    required: true,
    type: 'string',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  async getBusRouteFromBusStop(@Query() query: ReqBusStopDto): Promise<ResBusStopDto[]> {
    return await this.busNumberService.findBusRouteByBusStop(query.busStop, query.limit, query.sorting);
  }

  @Patch('info/update/:busNumber')
  @ApiOperation({ summary: '버스 정보 업데이트' })
  @ApiResponse({ status: 200, description: '버스 정보 업데이트 성공', type: ResInfoUpdateDto })
  @ApiResponse({ status: 400, description: '버스 정보 업데이트 실패' })
  @ApiResponse({ status: 404, description: '버스 정보 조회 실패' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  async updateBusInfo(@Param() param: ReqInfoUpdateByBusNumberDto, @Body() body: ReqInfoUpdateDto): Promise<ResInfoUpdateDto> {
    const queryState = await this.busNumberService.updateBusInfo(param.busNumber, body.busStatus, body.busBattery);

    return { message: queryState.message };
  }

  @Post('route/:busNumber')
  @ApiOperation({ summary: 'N번 버스 노선 추가' })
  @ApiResponse({ status: 201, description: 'N번 버스 노선 조회 성공', type: ResRouteCreateDto })
  @ApiResponse({ status: 400, description: 'N번 버스 노선 조회 실패' })
  @ApiResponse({ status: 404, description: 'N번 버스 노선 조회 실패' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  async createBusStopInRoute(@Param() param: ReqRouteUpdateByBusNumberDto, @Body() body: ReqRouteCreateDto): Promise<ResRouteCreateDto> {
    const queryState = await this.busNumberService.addBusStopInfo(
      param.busNumber,
      body.index,
      body.stopName,
      body.timetableWeekday,
      body.timetableHoliday,
    );

    return { message: queryState.message };
  }
}
