import { Entity, Column, PrimaryGeneratedColumn, Check } from 'typeorm';

@Entity('bus_routes')
export class BusRouteEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  route_id: string;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  bus_number: string;

  @Column({ type: 'longtext' })
  @Check('json_valid(`interval_min`)')
  interval_min: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  origin: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  destination: string;

  @Column({ type: 'longtext' })
  @Check('json_valid(`stops`)')
  stops: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  first_bus: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  last_bus: string;

  @Column({ type: 'longtext' })
  @Check('json_valid(`timetable_weekday`)')
  timetable_weekday: string;

  @Column({ type: 'longtext' })
  @Check('json_valid(`timetable_holiday`)')
  timetable_holiday: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  remarks: string;
}
