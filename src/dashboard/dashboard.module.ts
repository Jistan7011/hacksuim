import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusInfosEntity } from '../bus/bus-infos.entity';
import { SignalEntity } from '../monitoring/signal.entity';
import { BusPassengersEntity } from '../bus/bus-passengers.entity';
import { BusOccupancyRateEntity } from '../bus/bus-occupancy-rate.entity';
import { BusArrivalRateEntity } from '../bus/bus-arrival-rate.entity';
import { BusRouteUsageStatsEntity } from '../bus/bus-route-usage-stats.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BusInfosEntity,
      SignalEntity,
      BusPassengersEntity,
      BusOccupancyRateEntity,
      BusArrivalRateEntity,
      BusRouteUsageStatsEntity,
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
