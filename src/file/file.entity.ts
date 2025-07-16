import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('files')
export class FileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  file_id: string;

  @Column({ type: 'text', nullable: false })
  origin_filename: string;

  @Column({ type: 'text', nullable: false })
  hashed_filename: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  file_ext: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  file_mimetype: string;

  @Column({ type: 'bigint', nullable: false })
  file_size: number;

  @Column({ type: 'text', nullable: false })
  path: string;

  @CreateDateColumn()
  created_at: Date;
}
