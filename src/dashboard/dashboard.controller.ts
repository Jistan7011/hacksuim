import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../utils/auth/jwt-auth.guard';

import { DashboardService } from './dashboard.service';
import { ResDashboardDto } from './dto/res/res.dashboard.dto';
import { getDatetime } from '../utils/date/current-datetime.utils';

const getPercentChange = (previousCount: number, currentCount: number): string => {
  if (currentCount === 0) {
    return previousCount === 0 ? '0.00%' : 'N/A';
  }

  const change = ((currentCount - previousCount) / currentCount) * 100;
  const sign = change > 0 ? '+' : '';

  return `${sign}${change.toFixed(2)}%`;
};

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('/')
  @ApiOperation({ summary: '대시보드 데이터 조회' })
  @ApiResponse({ status: 200, description: '정보 조회 성공', type: ResDashboardDto })
  @ApiResponse({ status: 404, description: '정보 조회 실패' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  async getRealtimeVehicleInfoOverview(): Promise<ResDashboardDto> {
    const results: ResDashboardDto = new ResDashboardDto();

    // 실시간 자율주행 차량 정보
    const overviewBusInfo: any[] = await this.dashboardService.getOverviewBusInfo();
    // 실시간 주요 차량 배터리 정보
    const overviewBusBatteryInfo: any[] = await this.dashboardService.getOverviewBusBatteryInfo(8);
    // 주요 버스 정보
    const overviewBusListInfo: any[] = await this.dashboardService.getOverviewIntegratedBusInfo(8);
    // 실시간 상위 노선별 이용 통계
    const overviewRealtimeRouteUsageStats: any[] = await this.dashboardService.getOverviewRealtimeRouteUsageStats(
      getDatetime('yyyy-MM-dd HH:00:00'),
      3,
    );
    // 시간대별 이용자 정보/평균 탑승률/정시 도착률 (조회 일자 기준)
    const overviewBusPassengersInfo: any[] = await this.dashboardService.getOverviewBusPassengersInfo(
      getDatetime('yyyy-MM-dd'),
      getDatetime('yyyy-MM-dd', 1),
    );
    const overviewOccupancyRateInfo: any[] = await this.dashboardService.getOverviewOccupancyRateInfo(
      getDatetime('yyyy-MM-dd'),
      getDatetime('yyyy-MM-dd', 1),
    );
    const overviewArrivalRateInfo: any[] = await this.dashboardService.getOverviewArrivalRateInfo(
      getDatetime('yyyy-MM-dd'),
      getDatetime('yyyy-MM-dd', 1),
    );
    // 정상/경고/에러 신호 발생 수
    const overviewCurrentDateSignalInfo: any[] = await this.dashboardService.getOverviewSignalInfo(getDatetime('yyyy-MM-dd'));
    const overviewPreviousDateSignalInfo: any[] = await this.dashboardService.getOverviewSignalInfo(getDatetime('yyyy-MM-dd', -1));

    if (Array.isArray(overviewBusInfo) && overviewBusInfo.length > 0) {
      results.busInfoOverview.operatingVehicleCount = overviewBusInfo.filter((r) => r.busStatus === 1).length;
      results.busInfoOverview.standbyVehicleCount = overviewBusInfo.filter((r) => [2, 3].includes(r.busStatus)).length;
      results.busInfoOverview.faultyVehicleCount = overviewBusInfo.filter((r) => [0, 5].includes(r.busStatus)).length;
      results.busInfoOverview.averageBatteryLevel = overviewBusInfo.reduce((sum, { busBattery }) => sum + busBattery, 0) / overviewBusInfo.length;
    }

    if (Array.isArray(overviewBusBatteryInfo) && overviewBusBatteryInfo.length > 0) {
      overviewBusBatteryInfo.map((r) => {
        results.busBatteryInfoOverview.push({ busNumber: r.busNumber, busBattery: r.busBattery });
      });
    }

    if (Array.isArray(overviewBusListInfo) && overviewBusListInfo.length > 0) {
      overviewBusListInfo.map((r) => {
        results.busIntegrateOverview.push({
          busNumber: r.busNumber,
          stops: JSON.parse(r.stops),
          intervalMin: JSON.parse(r.intervalMin),
          firstBus: r.firstBus,
          lastBus: r.lastBus,
          busStatus: r.busStatus,
        });
      });
    }

    if (Array.isArray(overviewRealtimeRouteUsageStats) && overviewRealtimeRouteUsageStats.length > 0) {
      overviewRealtimeRouteUsageStats.map((r) => {
        results.busRealtimeRouteStatisticsOverview.push({
          brtusId: r.brtusId,
          busNumber: r.busNumber,
          recordDatetime: r.recordDatetime,
          userCount: r.userCount,
          stopDistribution: JSON.parse(r.stopDistribution),
          createdAt: r.createdAt,
        });
      });
    }

    results.busPassengersStatisticsOverview.date = getDatetime('yyyy-MM-dd');
    if (Array.isArray(overviewBusPassengersInfo) && overviewBusPassengersInfo.length > 0) {
      overviewBusPassengersInfo.map((r) => {
        results.busPassengersStatisticsOverview.data.push(r.passengerCount);
      });
    }

    results.busOccupancyRateStatisticsOverview.date = getDatetime('yyyy-MM-dd');
    if (Array.isArray(overviewOccupancyRateInfo) && overviewOccupancyRateInfo.length > 0) {
      overviewOccupancyRateInfo.map((r) => {
        results.busOccupancyRateStatisticsOverview.data.push(r.avgOccupancyRate);
      });
    }

    results.busArrivalRateStatisticsOverview.date = getDatetime('yyyy-MM-dd');
    if (Array.isArray(overviewArrivalRateInfo) && overviewArrivalRateInfo.length > 0) {
      overviewArrivalRateInfo.map((r) => {
        results.busArrivalRateStatisticsOverview.data.push(r.onTimeArrivalRate);
      });
    }

    if (Array.isArray(overviewCurrentDateSignalInfo) && overviewCurrentDateSignalInfo.length > 0) {
      overviewCurrentDateSignalInfo.map((r) => {
        if (r.signalType === 0) {
          results.busSignalStatisticsOverview.successSignal.current += 1;
        }

        if (r.signalType === 1) {
          results.busSignalStatisticsOverview.warningSignal.current += 1;
        }

        if (r.signalType === 2) {
          results.busSignalStatisticsOverview.errorSignal.current += 1;
        }
      });
    }

    if (Array.isArray(overviewPreviousDateSignalInfo) && overviewPreviousDateSignalInfo.length > 0) {
      overviewPreviousDateSignalInfo.map((r) => {
        if (r.signalType === 0) {
          results.busSignalStatisticsOverview.successSignal.previous += 1;
        }

        if (r.signalType === 1) {
          results.busSignalStatisticsOverview.warningSignal.previous += 1;
        }

        if (r.signalType === 2) {
          results.busSignalStatisticsOverview.errorSignal.previous += 1;
        }
      });
    }

    results.busSignalStatisticsOverview.successSignal.average = getPercentChange(
      results.busSignalStatisticsOverview.successSignal.current,
      results.busSignalStatisticsOverview.successSignal.previous,
    );
    results.busSignalStatisticsOverview.warningSignal.average = getPercentChange(
      results.busSignalStatisticsOverview.warningSignal.current,
      results.busSignalStatisticsOverview.warningSignal.previous,
    );
    results.busSignalStatisticsOverview.errorSignal.average = getPercentChange(
      results.busSignalStatisticsOverview.errorSignal.current,
      results.busSignalStatisticsOverview.errorSignal.previous,
    );

    return results;
  }
}
