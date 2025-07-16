import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../utils/auth/jwt-auth.guard';

import { SignalService } from './signal.service';
import { ReqSignalsByBusNumberDto, ReqSignalsDto } from './dto/req/req.signals.dto';
import { ResSignalsDto } from './dto/res/res.signals.dto';

@ApiTags('Bus Signal Logging')
@Controller('signal')
export class SignalController {
  constructor(private readonly signalService: SignalService) {}

  @Get('/')
  @ApiOperation({ summary: '시그널 데이터 조회' })
  @ApiResponse({ status: 200, description: '정보 조회 성공', type: ResSignalsDto, isArray: true })
  @ApiResponse({ status: 404, description: '정보 조회 실패' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @ApiQuery({
    name: 'signalType',
    description: '',
    required: true,
    type: 'string',
  })
  @ApiQuery({
    name: 'startDate',
    description: '',
    required: true,
    type: 'string',
  })
  @ApiQuery({
    name: 'endDate',
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
  @ApiQuery({
    name: 'limit',
    description: '',
    required: false,
    type: 'string',
  })
  async getAllSignals(@Query() dtoQuery: ReqSignalsDto): Promise<ResSignalsDto[]> {
    return await this.signalService.getAllVehicleSignals(dtoQuery.signalType, dtoQuery.startDate, dtoQuery.endDate, dtoQuery.sorting, dtoQuery.limit);
  }

  @Get('/:busNumber')
  @ApiOperation({ summary: '시그널 데이터 조회' })
  @ApiResponse({ status: 200, description: '정보 조회 성공', type: ResSignalsDto, isArray: true })
  @ApiResponse({ status: 404, description: '정보 조회 실패' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @ApiQuery({
    name: 'signalType',
    description: '',
    required: true,
    type: 'string',
  })
  @ApiQuery({
    name: 'startDate',
    description: '',
    required: true,
    type: 'string',
  })
  @ApiQuery({
    name: 'endDate',
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
  @ApiQuery({
    name: 'limit',
    description: '',
    required: false,
    type: 'string',
  })
  @ApiParam({
    name: 'busNumber',
    description: '조회할 버스 배차 번호',
    required: true,
    type: 'string',
  })
  async getSignals(@Param() dtoParam: ReqSignalsByBusNumberDto, @Query() dtoQuery: ReqSignalsDto): Promise<ResSignalsDto[]> {
    return await this.signalService.getVehicleSignals(
      dtoParam.busNumber,
      dtoQuery.signalType,
      dtoQuery.startDate,
      dtoQuery.endDate,
      dtoQuery.sorting,
      dtoQuery.limit,
    );
  }
}
