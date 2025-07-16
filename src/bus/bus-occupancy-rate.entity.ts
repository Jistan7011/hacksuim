import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('bus_time_slot_occupancy_rate')
export class BusOccupancyRateEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  btsor_id: string;

  @Column({ type: 'date', nullable: false })
  record_date: string;

  @Column({ type: 'time', nullable: false })
  interval_start: string;

  @Column({ type: 'time', nullable: false })
  interval_end: string;

  @Column({ type: 'time', nullable: false })
  record_time: string;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: false,
  })
  avg_occupancy_rate: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
