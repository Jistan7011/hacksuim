import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { createReadStream, existsSync } from 'fs';
import * as fs from 'fs/promises';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';

import { BadRequestException, InternalServerErrorException, NotFoundException } from '../common/exception';
import { FileEntity } from './file.entity';

@Injectable()
export class FileService {
  private readonly maxFileSize: number = 5 * 1024 * 1024;
  private readonly allowedExtensions: string[] = ['.jpg', '.jpeg', '.png', '.gif', '.txt'];
  private readonly mimeRegex: RegExp = /^(?:image\/(?:jpeg|png|gif)|text\/plain)$/;

  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    private readonly configService: ConfigService,
  ) {}

  async saveByUploadedFile(file: Express.Multer.File): Promise<any> {
    if (!file || !file.path) {
      throw new BadRequestException('정상적인 파일이 아님.');
    }

    if (!existsSync(file.path)) {
      throw new InternalServerErrorException('파일 저장 중 오류발생.');
    }

    if (file.size > this.maxFileSize) {
      await fs.unlink(file.path);
      throw new BadRequestException('정상적인 파일이 아님.');
    }

    const originalExtension: string = extname(file.originalname).toLowerCase();
    if (!this.allowedExtensions.includes(originalExtension) || !this.mimeRegex.test(file.mimetype)) {
      await fs.unlink(file.path);
      throw new BadRequestException('허용되지 않는 파일 형식.');
    }

    const uploadDir = this.configService.get<string>('UPLOAD_FILE_PATH');
    if (!uploadDir) {
      throw new InternalServerErrorException('서버 오류 발생.');
    }

    const fileId = uuidv4();

    await this.fileRepository
      .createQueryBuilder()
      .insert()
      .into(FileEntity)
      .values({
        file_id: fileId,
        origin_filename: file.originalname,
        hashed_filename: file.filename,
        file_ext: originalExtension,
        file_mimetype: file.mimetype,
        file_size: file.size,
        path: uploadDir,
      })
      .execute();

    const qb: FileEntity | null = await this.fileRepository
      .createQueryBuilder('files')
      .where('files.file_id = :file_id', { file_id: fileId })
      .getOne();

    if (qb === null) {
      throw new InternalServerErrorException('파일 저장 실패.');
    }

    return {
      fileId: qb.file_id,
      originFilename: qb.origin_filename,
      hashedFilename: qb.hashed_filename,
      fileMimetype: qb.file_mimetype,
      fileExt: qb.file_ext,
      fileSize: qb.file_size,
      path: qb.path,
      createdAt: qb.created_at,
    };
  }

  async getFileInfo(fileId: string): Promise<any> {
    const qb: FileEntity | null = await this.fileRepository
      .createQueryBuilder('files')
      .where('files.file_id = :file_id', { file_id: fileId })
      .getOne();

    if (qb === null) {
      throw new NotFoundException('파일 정보가 존재하지 않음.');
    }

    return {
      fileId: qb.file_id,
      originFilename: qb.origin_filename,
      hashedFilename: qb.hashed_filename,
      fileMimetype: qb.file_mimetype,
      fileExt: qb.file_ext,
      fileSize: qb.file_size,
      path: qb.path,
      createdAt: qb.created_at,
    };
  }

  async downloadFile(filename: string) {
    const uploadDir = this.configService.get<string>('UPLOAD_FILE_PATH');
    if (!uploadDir) {
      throw new InternalServerErrorException('서버 오류 발생.');
    }

    const filePath = join(uploadDir, filename);

    if (!existsSync(filePath)) {
      throw new NotFoundException('존재하지 않는 파일');
    }

    return createReadStream(filePath);
  }

  async downloadFileByFileId(fileId: string) {
    const rows: any[] = await this.fileRepository.query(
      `SELECT hashed_filename, path
       FROM files
       WHERE file_id = ?
       LIMIT 1`,
      [fileId],
    );

    let filename: string = '';
    let path: string = '';
    if (Array.isArray(rows) && rows.length === 1) {
      filename = rows[0].hashed_filename;
      path = rows[0].path;
    }

    if (!filename || !path) {
      throw new NotFoundException('존재하지 않는 파일.');
    }

    const filePath = join(path, filename);

    if (!existsSync(filePath)) {
      throw new NotFoundException('존재하지 않는 파일');
    }

    return createReadStream(filePath);
  }
}
