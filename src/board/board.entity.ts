import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('boards')
export class BoardEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  board_id: string;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  writer_email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  file_id: string | null;

  @Column({ type: 'varchar', length: 255, nullable: false })
  board_type: string;

  @Column({ type: 'text', nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  content: string;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;
}
