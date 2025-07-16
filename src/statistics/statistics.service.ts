import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BusPassengersEntity } from '../bus/bus-passengers.entity';
import { BusOccupancyRateEntity } from '../bus/bus-occupancy-rate.entity';
import { BusArrivalRateEntity } from '../bus/bus-arrival-rate.entity';
import { BusRouteUsageStatsEntity } from '../bus/bus-route-usage-stats.entity';
import { BusInfosEntity } from '../bus/bus-infos.entity';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(BusInfosEntity)
    private busInfoRepository: Repository<BusInfosEntity>,
    @InjectRepository(BusRouteUsageStatsEntity)
    private busRouteUsageStatsRepository: Repository<BusRouteUsageStatsEntity>,
    @InjectRepository(BusOccupancyRateEntity)
    private busOccupancyRateRepository: Repository<BusOccupancyRateEntity>,
    @InjectRepository(BusArrivalRateEntity)
    private busArrivalRateRepository: Repository<BusArrivalRateEntity>,
    @InjectRepository(BusPassengersEntity)
    private busPassengersRepository: Repository<BusPassengersEntity>,
  ) {}

  // (기존 QueryBuilder 사용 메서드들은 변경 없이 유지)
  async getStatisticsBusPassengersInfo(
    start_date: string,
    end_date: string,
  ): Promise<any[]> {
    const qb = await this.busPassengersRepository
      .createQueryBuilder('bus_passengers')
      .where('bus_passengers.created_at > :start', {
        start: `${start_date} 00:00:00`,
      })
      .andWhere('bus_passengers.created_at <= :end', {
        end: `${end_date} 00:00:00`,
      })
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

  async getStatisticsOccupancyRateInfo(
    start_date: string,
    end_date: string,
  ): Promise<any[]> {
    const qb = await this.busOccupancyRateRepository
      .createQueryBuilder('bus_time_slot_occupancy_rate')
      .where('bus_time_slot_occupancy_rate.created_at > :start', {
        start: `${start_date} 00:00:00`,
      })
      .andWhere('bus_time_slot_occupancy_rate.created_at <= :end', {
        end: `${end_date} 00:00:00`,
      })
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

  async getStatisticsArrivalRateInfo(
    start_date: string,
    end_date: string,
  ): Promise<any[]> {
    const qb = await this.busArrivalRateRepository
      .createQueryBuilder('bus_time_slot_on_time_arrival_rate')
      .where('bus_time_slot_on_time_arrival_rate.created_at > :start', {
        start: `${start_date} 00:00:00`,
      })
      .andWhere('bus_time_slot_on_time_arrival_rate.created_at <= :end', {
        end: `${end_date} 00:00:00`,
      })
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

  async getStatisticsRealtimeRouteUsageInfo(
    datetime: string,
    limit: number,
  ): Promise<any[]> {
    // limit 범위 검증 (옵션)
    if (limit < 1 || limit > 100) {
      throw new BadRequestException('limit must be between 1 and 100');
    }

    const sql = `
      SELECT
        brrus.brtus_id           AS brtusId,
        bi.bus_number            AS busNumber,
        brrus.route_id           AS routeId,
        brrus.record_datetime    AS recordDatetime,
        brrus.user_count         AS userCount,
        brrus.stop_distribution  AS stopDistribution,
        brrus.created_at         AS createdAt,
        brrus.updated_at         AS updatedAt
      FROM bus_realtime_route_usage_stats brrus
      JOIN bus_infos bi
        ON brrus.bus_id = bi.bus_id
       AND bi.bus_status = 0
      WHERE brrus.record_datetime = ?
      ORDER BY brrus.user_count
      LIMIT ?
    `;
    return this.busRouteUsageStatsRepository.query(sql, [datetime, limit]);
  }

  async getStatisticsIntegratedBusInfo(limit: number): Promise<any[]> {
    // limit 범위 검증 (옵션)
    if (limit < 1 || limit > 100) {
      throw new BadRequestException('limit must be between 1 and 100');
    }

    const sql = `
      SELECT
        bi.bus_number      AS busNumber,
        br.stops           AS stops,
        br.interval_min    AS intervalMin,
        br.first_bus       AS firstBus,
        br.last_bus        AS lastBus,
        bi.bus_status      AS busStatus
      FROM bus_infos bi
      JOIN bus_routes br
        ON bi.bus_number = br.bus_number
      ORDER BY RAND()
      LIMIT ?
    `;
    return this.busInfoRepository.query(sql, [limit]);
  }

  async getStatisticsBusBatteryInfo(limit: number): Promise<any[]> {
    const qb = await this.busInfoRepository
      .createQueryBuilder('bus_infos')
      .select([
        'bus_infos.id',
        'bus_infos.bus_number',
        'bus_infos.bus_battery',
      ])
      .orderBy('RAND()', 'ASC')
      .limit(limit)
      .getMany();

    return qb.map((r) => ({
      id: r.id,
      busNumber: r.bus_number,
      busBattery: r.bus_battery,
    }));
  }
}
