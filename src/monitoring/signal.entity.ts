import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('bus_realtime_signals')
export class SignalEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  bus_id: string;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  signal_id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  signal_name: string;

  @Column({ type: 'integer', nullable: false })
  signal_type: number;

  @Column({ type: 'text', nullable: false })
  signal_description: string;

  @CreateDateColumn()
  created_at: Date;
}
