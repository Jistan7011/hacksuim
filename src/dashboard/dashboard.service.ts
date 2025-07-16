import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BusInfosEntity } from '../bus/bus-infos.entity';
import { SignalEntity } from '../monitoring/signal.entity';

import { BusRouteUsageStatsEntity } from '../bus/bus-route-usage-stats.entity';
import { BusArrivalRateEntity } from '../bus/bus-arrival-rate.entity';
import { BusOccupancyRateEntity } from '../bus/bus-occupancy-rate.entity';
import { BusPassengersEntity } from '../bus/bus-passengers.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(BusInfosEntity)
    private busInfoRepository: Repository<BusInfosEntity>,
    @InjectRepository(SignalEntity)
    private signalRepository: Repository<SignalEntity>,
    @InjectRepository(BusPassengersEntity)
    private busPassengersRepository: Repository<BusPassengersEntity>,
    @InjectRepository(BusOccupancyRateEntity)
    private busOccupancyRateRepository: Repository<BusOccupancyRateEntity>,
    @InjectRepository(BusArrivalRateEntity)
    private busArrivalRateRepository: Repository<BusArrivalRateEntity>,
    @InjectRepository(BusRouteUsageStatsEntity)
    private busRouteUsageStatsRepository: Repository<BusRouteUsageStatsEntity>,
  ) {}

  async getOverviewBusInfo(): Promise<any[]> {
    const qb: BusInfosEntity[] = await this.busInfoRepository
      .createQueryBuilder('bus_infos')
      .select(['bus_infos.bus_number', 'bus_infos.bus_status', 'bus_infos.bus_battery'])
      .getMany();

    return qb.map((r) => ({
      busNumber: r.bus_number,
      busStatus: r.bus_status,
      busBattery: r.bus_battery,
    }));
  }

  async getOverviewSignalInfo(datetime: string): Promise<any[]> {
    const qb: SignalEntity[] = await this.signalRepository
      .createQueryBuilder('bus_realtime_signals')
      .select(['bus_realtime_signals.id', 'bus_realtime_signals.signal_type'])
      .where('bus_realtime_signals.created_at >= :start_date', { start_date: datetime + ' 00:00:00' })
      .andWhere('bus_realtime_signals.created_at <= :end_date', { end_date: datetime + ' 23:59:59' })
      .getMany();

    return qb.map((r) => ({
      id: r.id,
      signalType: r.signal_type,
    }));
  }

  async getOverviewBusBatteryInfo(limit: number): Promise<any[]> {
    const qb: BusInfosEntity[] = await this.busInfoRepository
      .createQueryBuilder('bus_infos')
      .select(['bus_infos.id', 'bus_infos.bus_number', 'bus_infos.bus_battery'])
      .orderBy('RAND()', 'ASC')
      .limit(limit)
      .getMany();

    return qb.map((r) => ({
      id: r.id,
      busNumber: r.bus_number,
      busBattery: r.bus_battery,
    }));
  }

  async getOverviewIntegratedBusInfo(limit: number): Promise<any[]> {
    return this.busInfoRepository.query(
      `SELECT bus_infos.bus_number as busNumber,
              br.stops            as stops,
              br.interval_min     as intervalMin,
              br.first_bus        as firstBus,
              br.last_bus         as lastBus,
              bus_infos.bus_status as busStatus
       FROM bus_infos
              JOIN bus_routes br ON bus_infos.bus_number = br.bus_number
       ORDER BY RAND()
       LIMIT ${limit}`,
    );
  }

  async getOverviewRealtimeRouteUsageStats(datetime: string, limit: number): Promise<any[]> {
    return this.busRouteUsageStatsRepository.query(
      `SELECT brrus.brtus_id          as brtusId,
              bi.bus_number           as busNumber,
              brrus.route_id          as routeId,
              brrus.record_datetime   as recordDatetime,
              brrus.user_count        as userCount,
              brrus.stop_distribution as stopDistribution,
              brrus.created_at        as createdAt,
              brrus.updated_at        as updatedAt
       FROM bus_realtime_route_usage_stats brrus
              JOIN bus_infos bi ON brrus.bus_id = bi.bus_id AND bi.bus_status = 0
       WHERE record_datetime = '${datetime}'
       ORDER BY brrus.user_count
       LIMIT ${limit}`,
    );
  }

  async getOverviewBusPassengersInfo(start_date: string, end_date: string): Promise<any[]> {
    const qb: BusPassengersEntity[] = await this.busPassengersRepository
      .createQueryBuilder('bus_passengers')
      .where('bus_passengers.created_at > :start_date', { start_date: start_date + ' 00:00:00' })
      .andWhere('bus_passengers.created_at <= :end_date', { end_date: end_date + ' 00:00:00' })
      .getMany();

    return qb.map((r) => ({
      id: r.id,
      bpId: r.bp_id,
      recordDate: r.record_date,
      intervalStart: r.interval_start,
      intervalEnd: r.interval_end,
      recordTime: r.record_time,
      passengerCount: r.passenger_count,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));
  }

  async getOverviewOccupancyRateInfo(start_date: string, end_date: string): Promise<any[]> {
    const qb: BusOccupancyRateEntity[] = await this.busOccupancyRateRepository
      .createQueryBuilder('bus_time_slot_occupancy_rate')
      .where('bus_time_slot_occupancy_rate.created_at > :start_date', { start_date: start_date + ' 00:00:00' })
      .andWhere('bus_time_slot_occupancy_rate.created_at <= :end_date', { end_date: end_date + ' 00:00:00' })
      .getMany();

    return qb.map((r) => ({
      id: r.id,
      btsorId: r.btsor_id,
      recordDate: r.record_date,
      intervalStart: r.interval_start,
      intervalEnd: r.interval_end,
      recordTime: r.record_time,
      avgOccupancyRate: r.avg_occupancy_rate,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));
  }

  async getOverviewArrivalRateInfo(start_date: string, end_date: string): Promise<any[]> {
    const qb: BusArrivalRateEntity[] = await this.busArrivalRateRepository
      .createQueryBuilder('bus_time_slot_on_time_arrival_rate')
      .where('bus_time_slot_on_time_arrival_rate.created_at > :start_date', { start_date: start_date + ' 00:00:00' })
      .andWhere('bus_time_slot_on_time_arrival_rate.created_at <= :end_date', { end_date: end_date + ' 00:00:00' })
      .getMany();

    return qb.map((r) => ({
      id: r.id,
      btotarId: r.btotar_id,
      recordDate: r.record_date,
      intervalStart: r.interval_start,
      intervalEnd: r.interval_end,
      recordTime: r.record_time,
      onTimeArrivalRate: r.on_time_arrival_rate,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));
  }
}
