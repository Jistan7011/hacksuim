import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

import { FileController } from './file.controller';
import { FileService } from './file.service';
import { FileEntity } from './file.entity';
import { BadRequestException } from '../common/exception';

const MAX_SIZE: number = 5 * 1024 * 1024;
const ALLOWED_EXTENSIONS: string[] = ['.jpg', '.jpeg', '.png', '.gif', '.txt'];
const ALLOWED_MIMES: string[] = ['image/jpeg', 'image/png', 'image/gif', 'text/plain'];

@Module({
  imports: [
    TypeOrmModule.forFeature([FileEntity]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        limits: { fileSize: MAX_SIZE },
        fileFilter(req, file, cb) {
          const originalExtension = extname(file.originalname).toLowerCase();

          if (!ALLOWED_EXTENSIONS.includes(originalExtension) || !ALLOWED_MIMES.includes(file.mimetype)) {
            return cb(new BadRequestException('허용되지 않는 파일 형식입니다.'), false);
          }

          cb(null, true);
        },
        storage: diskStorage({
          destination: config.get<string>('UPLOAD_FILE_PATH'),
          filename: (_req, file, cb) => {
            const originalExtension = extname(file.originalname).toLowerCase();
            const fileId = uuidv4();
            const hashedName = `${fileId}${originalExtension}`;

            cb(null, hashedName);
          },
        }),
      }),
    }),
  ],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
