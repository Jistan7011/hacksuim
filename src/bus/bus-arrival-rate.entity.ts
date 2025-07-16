import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('bus_time_slot_on_time_arrival_rate')
export class BusArrivalRateEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  btotar_id: string;

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
  on_time_arrival_rate: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
