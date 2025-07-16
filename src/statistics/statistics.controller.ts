import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../utils/auth/jwt-auth.guard';

import { getDatetime } from '../utils/date/current-datetime.utils';
import { StatisticsService } from './statistics.service';
import { ResStatisticsDto } from './dto/res/res.statistics.dto';

@ApiTags('Statistics')
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('/')
  @ApiOperation({ summary: '통계 데이터 조회' })
  @ApiResponse({ status: 200, description: '정보 조회 성공', type: ResStatisticsDto })
  @ApiResponse({ status: 404, description: '정보 조회 실패' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  async getStatistics(): Promise<ResStatisticsDto> {
    const results: ResStatisticsDto = new ResStatisticsDto();

    // 시간대별 이용자 정보/평균 탑승률/정시 도착률 (조회 일자 기준)
    const statisticsBusPassengersInfo: any[] = await this.statisticsService.getStatisticsBusPassengersInfo(
      getDatetime('yyyy-MM-dd'),
      getDatetime('yyyy-MM-dd', 1),
    );
    const statisticsOccupancyRateInfo: any[] = await this.statisticsService.getStatisticsOccupancyRateInfo(
      getDatetime('yyyy-MM-dd'),
      getDatetime('yyyy-MM-dd', 1),
    );
    const statisticsArrivalRateInfo: any[] = await this.statisticsService.getStatisticsArrivalRateInfo(
      getDatetime('yyyy-MM-dd'),
      getDatetime('yyyy-MM-dd', 1),
    );
    // 실시간 상위 노선별 이용 통계
    const statisticsRealtimeRouteUsageInfo: any[] = await this.statisticsService.getStatisticsRealtimeRouteUsageInfo(
      getDatetime('yyyy-MM-dd HH:00:00'),
      3,
    );
    // 실시간 주요 차량 배터리 정보
    const statisticsBusBatteryInfo: any[] = await this.statisticsService.getStatisticsBusBatteryInfo(8);
    // 주요 버스 정보 - 통계 연동
    const statisticsIntegratedBusInfo: any[] = await this.statisticsService.getStatisticsIntegratedBusInfo(8);

    results.busPassengersStatistics.date = getDatetime('yyyy-MM-dd');
    if (Array.isArray(statisticsBusPassengersInfo) && statisticsBusPassengersInfo.length > 0) {
      statisticsBusPassengersInfo.map((r) => {
        results.busPassengersStatistics.data.push(r.passengerCount);
      });
    }

    results.busOccupancyRateStatistics.date = getDatetime('yyyy-MM-dd');
    if (Array.isArray(statisticsOccupancyRateInfo) && statisticsOccupancyRateInfo.length > 0) {
      statisticsOccupancyRateInfo.map((r) => {
        results.busOccupancyRateStatistics.data.push(r.avgOccupancyRate);
      });
    }

    results.busArrivalRateStatistics.date = getDatetime('yyyy-MM-dd');
    if (Array.isArray(statisticsArrivalRateInfo) && statisticsArrivalRateInfo.length > 0) {
      statisticsArrivalRateInfo.map((r) => {
        results.busArrivalRateStatistics.data.push(r.onTimeArrivalRate);
      });
    }

    if (Array.isArray(statisticsRealtimeRouteUsageInfo) && statisticsRealtimeRouteUsageInfo.length > 0) {
      statisticsRealtimeRouteUsageInfo.map((r) => {
        results.busRealtimeRouteStatistics.push({
          brtusId: r.brtusId,
          busNumber: r.busNumber,
          recordDatetime: r.recordDatetime,
          userCount: r.userCount,
          stopDistribution: JSON.parse(r.stopDistribution),
          createdAt: r.createdAt,
        });
      });
    }

    if (Array.isArray(statisticsBusBatteryInfo) && statisticsBusBatteryInfo.length > 0) {
      statisticsBusBatteryInfo.map((r) => {
        results.busBatteryInfoStatistics.push({ busNumber: r.busNumber, busBattery: r.busBattery });
      });
    }

    if (Array.isArray(statisticsIntegratedBusInfo) && statisticsIntegratedBusInfo.length > 0) {
      statisticsIntegratedBusInfo.map((r) => {
        results.busIntegrateStatistics.push({
          busNumber: r.busNumber,
          stops: JSON.parse(r.stops),
          intervalMin: JSON.parse(r.intervalMin),
          firstBus: r.firstBus,
          lastBus: r.lastBus,
          busStatus: r.busStatus,
        });
      });
    }

    return results;
  }
}
