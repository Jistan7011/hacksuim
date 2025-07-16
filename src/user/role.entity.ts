import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('roles')
export class RoleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  role_name: string;

  @Column({ type: 'integer', unique: true })
  role_type: number;

  @Column({ type: 'text' })
  role_description: string;
}
