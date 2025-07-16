import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';

import { BusOccupancyRateEntity } from '../bus/bus-occupancy-rate.entity';
import { BusArrivalRateEntity } from '../bus/bus-arrival-rate.entity';
import { BusPassengersEntity } from '../bus/bus-passengers.entity';
import { BusRouteUsageStatsEntity } from '../bus/bus-route-usage-stats.entity';
import { BusInfosEntity } from '../bus/bus-infos.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BusInfosEntity, BusRouteUsageStatsEntity, BusOccupancyRateEntity, BusArrivalRateEntity, BusPassengersEntity])],
  controllers: [StatisticsController],
  providers: [StatisticsService],
  exports: [StatisticsService],
})
export class StatisticsModule {}
