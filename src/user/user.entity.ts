import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  phone_number: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  birthday: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  position: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  department: string;

  @Column({ type: 'varchar', length: 255, default: 'level_3', nullable: true })
  role: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
