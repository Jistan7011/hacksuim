import { Entity, Column, PrimaryGeneratedColumn, Check, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('bus_realtime_route_usage_stats')
export class BusRouteUsageStatsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  brtus_id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  bus_id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  route_id: string;

  @Column({ type: 'datetime', nullable: false })
  record_datetime: string;

  @Column({ type: 'integer', nullable: false })
  user_count: number;

  @Column({ type: 'longtext' })
  @Check('json_valid(`stop_distribution`)')
  stop_distribution: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
