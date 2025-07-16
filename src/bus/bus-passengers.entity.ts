import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('bus_passengers')
export class BusPassengersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  bp_id: string;

  @Column({ type: 'date', nullable: false })
  record_date: string;

  @Column({ type: 'time', nullable: false })
  interval_start: string;

  @Column({ type: 'time', nullable: false })
  interval_end: string;

  @Column({ type: 'time', nullable: false })
  record_time: string;

  @Column({ type: 'integer', nullable: false })
  passenger_count: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
