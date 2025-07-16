import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('bus_infos')
export class BusInfosEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  bus_id: string;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  bus_number: string;

  @Column({ type: 'tinyint', nullable: false, default: 1 })
  bus_status: number;

  @Column({ type: 'integer', default: 100 })
  bus_battery: number;
}
