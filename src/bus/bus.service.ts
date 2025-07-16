import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { spawn } from 'child_process';

import { BadRequestException, NotFoundException } from '../common/exception';

import { BusRouteEntity } from './bus-route.entity';
import { BusInfosEntity } from './bus-infos.entity';

@Injectable()
export class BusService {
  constructor(
    @InjectRepository(BusInfosEntity)
    private busInfoRepository: Repository<BusInfosEntity>,
    @InjectRepository(BusRouteEntity)
    private busRouteRepository: Repository<BusRouteEntity>,
  ) {}

  async findAllBusInfos(busStatus: string): Promise<any[]> {
    const sanitizeBusStatus = parseInt(busStatus);

    const qb: BusInfosEntity[] = await this.busInfoRepository
      .createQueryBuilder('bus_infos')
      .select(['bus_infos.bus_number', 'bus_infos.bus_status', 'bus_infos.bus_battery'])
      .where('bus_infos.bus_status = :bus_status', { bus_status: sanitizeBusStatus })
      .getMany();

    return qb.map((r) => ({
      busNumber: r.bus_number,
      busStatus: r.bus_status,
      busBattery: r.bus_battery,
    }));
  }

  async findBusInfoByBusNumber(busNumber: string, busStatus: string): Promise<any> {
    if (!['0', '1', '2', '3', '5'].includes(busStatus)) {
      return {};
    }

    const rows = await this.busInfoRepository.query(
      `SELECT bus_number as busNumber, bus_status as busStatus, bus_battery as busBattery
       FROM bus_infos
       WHERE bus_number = '${busNumber}' AND bus_status = ${busStatus} LIMIT 1`,
    );

    if (Array.isArray(rows) && rows.length > 0) {
      return rows[0];
    }

    return {};
  }

  async findBusRouteByBusNumber(busNumber: string): Promise<any> {
    const rows: any[] = await this.busRouteRepository.query(
      `SELECT bus_infos.bus_number         as busNumber,
              bus_infos.bus_status         as busStatus,
              bus_routes.route_id          as routeId,
              bus_routes.interval_min      as intervalMin,
              bus_routes.origin            as origin,
              bus_routes.destination       as destination,
              bus_routes.stops             as stops,
              bus_routes.first_bus         as firstBus,
              bus_routes.last_bus          as lastBus,
              bus_routes.timetable_weekday as timetableWeekday,
              bus_routes.timetable_holiday as timetableHoliday,
              bus_routes.remarks           as remarks
       FROM bus_infos
              JOIN bus_routes ON bus_infos.bus_number = bus_routes.bus_number
       WHERE bus_infos.bus_number = '${busNumber}' LIMIT 1`,
    );

    if (Array.isArray(rows) && rows.length > 0) {
      const intervalMin = JSON.parse(rows[0].intervalMin);

      return {
        busNumber: rows[0].busNumber,
        busStatus: rows[0].busStatus,
        routeId: rows[0].routeId,
        intervalMin: {
          rushHour: intervalMin.rush_hour,
          normal: intervalMin.normal,
          holiday: intervalMin.holiday,
        },
        origin: rows[0].origin,
        destination: rows[0].destination,
        stops: JSON.parse(rows[0].stops),
        firstBus: rows[0].firstBus,
        lastBus: rows[0].lastBus,
        timetableWeekday: JSON.parse(rows[0].timetableWeekday),
        timetableHoliday: JSON.parse(rows[0].timetableHoliday),
        remarks: rows[0].remarks,
      };
    }

    return {};
  }

  async findBusRouteByBusStop(busStop: string, limit: string, sorting: string): Promise<any[]> {
    let sanitize_limit = parseInt(limit);

    if (sanitize_limit > 100) {
      sanitize_limit = 100;
    }
    sorting = ['ASC', 'DESC'].includes(sorting) ? sorting : 'ASC';

    const rows: any[] = await this.busRouteRepository.query(
      `SELECT bus_routes.route_id          as routeId,
              bus_routes.interval_min      as intervalMin,
              bus_routes.origin            as origin,
              bus_routes.destination       as destination,
              bus_routes.stops             as stops,
              bus_routes.first_bus         as firstBus,
              bus_routes.last_bus          as lastBus,
              bus_routes.timetable_weekday as timetableWeekday,
              bus_routes.timetable_holiday as timetableHoliday,
              bus_routes.remarks           as remarks
       FROM bus_routes
       WHERE bus_routes.stops LIKE ?
       ORDER BY bus_routes.id ${sorting} 
       LIMIT ${sanitize_limit}
      `,
      [`%${busStop}%`],
    );

    return rows.map((r) => ({
      routeId: r.routeId,
      intervalMin: JSON.parse(r.intervalMin),
      origin: r.origin,
      destination: r.destination,
      stops: JSON.parse(r.stops),
      firstBus: r.firstBus,
      lastBus: r.lastBus,
      timetableWeekday: JSON.parse(r.timetableWeekday),
      timetableHoliday: JSON.parse(r.timetableHoliday),
      remarks: r.remarks,
    }));
  }

  async updateBusInfo(busNumber: string, busStatus?: number, busBattery?: number): Promise<any> {
    if ((busStatus === null || busStatus === undefined) && (busBattery === null || busBattery === undefined)) {
      throw new BadRequestException('업데이트할 데이터가 지정되지 않음.');
    }

    const message = '버스 정보 업데이트 성공';

    if (busBattery !== undefined && (busBattery < 0 || busBattery > 100)) {
      throw new BadRequestException('버스 배터리 정보는 0 이상 100 이하로 지정해야함.');
    }

    if (busStatus !== undefined && ![0, 1, 2, 3, 5].includes(busStatus)) {
      throw new BadRequestException('버스 상태 정보는 0, 1, 2, 3, 5 중 하나로 지정해야함.');
    }

    await new Promise<void>((resolve) => {
      const timeoutMs = 10000;
      const py = spawn(`/opt/venv/bin/python /system/selfdriving-bus-info-update.py bus_info ${busNumber}`, {
        shell: true,
        stdio: 'inherit',
      });

      const timer = setTimeout(() => {
        py.kill();
        resolve(undefined);
      }, timeoutMs);

      py.on('close', (code) => {
        clearTimeout(timer);
        resolve(undefined);
      });

      py.on('error', (err) => {
        clearTimeout(timer);
        resolve(undefined);
      });
    })

    const qb = await this.busInfoRepository
      .createQueryBuilder('bus_infos')
      .update(BusInfosEntity)
      .set({
        ...(busStatus !== undefined && { bus_status: busStatus }),
        ...(busBattery !== undefined && { bus_battery: busBattery }),
      })
      .where('bus_infos.bus_number = :bus_number', { bus_number: busNumber })
      .execute();

    if (!qb.affected) {
      throw new NotFoundException('버스 정보가 존재하지 않음.');
    }

    return { message: message };
  }

  async addBusStopInfo(busNumber: string, index: number, stopName: string, timetableWeekday: string, timetableHoliday: string): Promise<any> {
    let message = '노선 추가 성공';

    if (stopName === null || timetableWeekday === null || timetableHoliday === null) {
      throw new BadRequestException('노선 추가에 필수적인 데이터가 지정되지 않음.');
    }

    await new Promise<void>((resolve) => {
      const timeoutMs = 10000;
      const py = spawn(`/opt/venv/bin/python /system/selfdriving-bus-info-update.py bus_route ${busNumber}`, {
        shell: true,
        stdio: 'inherit',
      });

      const timer = setTimeout(() => {
        py.kill();
        resolve(undefined);
      }, timeoutMs);

      py.on('close', (code) => {
        clearTimeout(timer);
        resolve(undefined);
      });

      py.on('error', (err) => {
        clearTimeout(timer);
        resolve(undefined);
      });
    })

    const busRouteInfoByBusNumber: BusRouteEntity | null = await this.busRouteRepository
      .createQueryBuilder('bus_route')
      .where('bus_route.bus_number = :bus_number', { bus_number: busNumber })
      .getOne();

    if (!busRouteInfoByBusNumber) {
      throw new NotFoundException('버스 노선 정보가 존재하지 않음.');
    }

    const updatedStops: string[] = JSON.parse(busRouteInfoByBusNumber.stops);
    const updatedTimetableWeekday: string[] = JSON.parse(busRouteInfoByBusNumber.timetable_weekday);
    const updatedTimetableHoliday: string[] = JSON.parse(busRouteInfoByBusNumber.timetable_holiday);

    const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

    if (index < 0 || index > updatedStops.length) {
      throw new BadRequestException('인덱스 값이 올바르지 않음.');
    }

    if (!TIME_REGEX.test(timetableWeekday) || !TIME_REGEX.test(timetableHoliday)) {
      throw new BadRequestException('시간 값이 올바르지 않음.');
    }

    updatedStops.splice(index, 0, stopName);
    updatedTimetableWeekday.splice(index, 0, timetableWeekday);
    updatedTimetableHoliday.splice(index, 0, timetableHoliday);

    const qb = await this.busRouteRepository
      .createQueryBuilder('bus_route')
      .update(BusRouteEntity)
      .set({
        ...{ stops: JSON.stringify(updatedStops) },
        ...{ timetable_weekday: JSON.stringify(updatedTimetableWeekday) },
        ...{ timetable_holiday: JSON.stringify(updatedTimetableHoliday) },
      })
      .where('bus_number = :bus_number', { bus_number: busNumber })
      .execute();

    if (!qb.affected) {
      throw new NotFoundException('버스 노선 정보가 존재하지 않음.');
    }

    return { message: message };
  }
}
