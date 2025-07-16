import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignalEntity } from './signal.entity';

@Injectable()
export class SignalService {
  constructor(
    @InjectRepository(SignalEntity)
    private signalRepository: Repository<SignalEntity>,
  ) {}

  async getAllVehicleSignals(signalType: string, startDate: string, endDate: string, sorting: string, limit: string): Promise<any[]> {
    const SIGNAL_TYPE_MAP: Record<'normal' | 'warning' | 'error', string> = {
      normal: '0',
      warning: '1',
      error: '2',
    };

    signalType = SIGNAL_TYPE_MAP[signalType] ?? 'normal';

    return this.signalRepository.query(
      `SELECT id                 as id,
              bus_id             as busId,
              signal_id          as signalId,
              signal_name        as signalName,
              signal_type        as signalType,
              signal_description as signalDescription,
              created_at         as createdAt
       FROM bus_realtime_signals
       WHERE signal_type = ?
         AND created_at >= CONCAT(?, ' 00:00:00')
         AND created_at <= CONCAT(?, ' 23:59:59')
       ORDER BY created_at ${sorting ? sorting : 'ASC'} ${limit ? 'LIMIT ' + limit : ''}`,
      [signalType, startDate, endDate],
    );
  }

  async getVehicleSignals(busNumber: string, signalType: string, startDate: string, endDate: string, sorting: string, limit: string): Promise<any[]> {
    const SIGNAL_TYPE_MAP: Record<'normal' | 'warning' | 'error', string> = {
      normal: '0',
      warning: '1',
      error: '2',
    };

    signalType = SIGNAL_TYPE_MAP[signalType] ?? 'normal';

    return this.signalRepository.query(
      `SELECT brs.id                 as id,
              brs.bus_id             as busId,
              brs.signal_id          as signalId,
              brs.signal_name        as signalName,
              brs.signal_type        as signalType,
              brs.signal_description as signalDescription,
              brs.created_at         as createdAt
       FROM bus_realtime_signals brs
              JOIN bus_infos as bi ON brs.bus_id = bi.bus_id
       WHERE signal_type = ?
         AND bi.bus_number = ?
         AND created_at >= CONCAT(?, ' 00:00:00')
         AND created_at <= CONCAT(?, ' 23:59:59')
       ORDER BY created_at ${sorting ? sorting : 'ASC'} ${limit ? 'LIMIT ' + limit : ''}`,
      [signalType, busNumber, startDate, endDate],
    );
  }
}
