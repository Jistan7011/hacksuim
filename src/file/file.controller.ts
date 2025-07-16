import { Body, Controller, Get, Param, Post, Query, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

import { FileService } from './file.service';
import { JwtAuthGuard } from '../utils/auth/jwt-auth.guard';
import { BadRequestException } from '../common/exception';
import { ResUploadDto } from './dto/res/res.upload.dto';
import { ResDownloadDto } from './dto/res/res.download.dto';
import { ReqDownloadDto } from './dto/req/req.download.dto';
import { ReqUploadDto } from './dto/req/req.upload.dto';
import { ResFileInfoDto } from './dto/res/res.file-info.dto';

@ApiTags('File')
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @ApiOperation({ summary: '파일 업로드' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: ReqUploadDto })
  @ApiResponse({ status: 200, description: '파일 업로드 성공', type: ResUploadDto })
  @ApiResponse({ status: 400, description: '파일 업로드 실패' })
  @ApiResponse({ status: 500, description: '파일 업로드 실패' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File): Promise<ResUploadDto> {
    if (!file) {
      throw new BadRequestException('정상적인 파일이 아님.');
    }

    return this.fileService.saveByUploadedFile(file);
  }

  @Get(':fileId')
  @ApiOperation({ summary: '파일 조회' })
  @ApiBody({ type: ReqDownloadDto })
  @ApiResponse({ status: 200, description: '파일 조회 성공', type: ResFileInfoDto })
  @ApiResponse({ status: 404, description: '파일 조회 실패' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @ApiParam({
    name: 'fileId',
    description: '',
    required: true,
    type: 'string',
  })
  async fileInfo(@Param('fileId') fileId: string): Promise<ResFileInfoDto> {
    return await this.fileService.getFileInfo(fileId);
  }

  @Post('download')
  @ApiOperation({ summary: '파일 다운로드' })
  @ApiBody({ type: ReqDownloadDto })
  @ApiResponse({ status: 201, description: '파일 다운로드 성공', type: ResDownloadDto })
  @ApiResponse({ status: 404, description: '파일 다운로드 실패' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  async download(@Body() bodyDto: ReqDownloadDto, @Res() res: Response) {
    const buffer = await this.fileService.downloadFile(bodyDto.filename);

    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename=${bodyDto.originFilename}`,
    });

    buffer.pipe(res);
  }

  // TODO: 파일 다운로드 테스트
  @Get('download/:fileId')
  @ApiOperation({ summary: '시퀀스 기반 파일 다운로드' })
  @ApiResponse({ status: 200, description: '파일 다운로드 성공', type: ResDownloadDto })
  @ApiResponse({ status: 404, description: '파일 다운로드 실패' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @ApiParam({
    name: 'fileId',
    description: '',
    required: true,
    type: 'string',
  })
  @ApiQuery({
    name: 'filename',
    description: '',
    required: true,
    type: 'string',
  })
  async downloadSeq(@Param('fileId') fileId: string, @Query('filename') filename: string, @Res() res: Response) {
    const buffer = await this.fileService.downloadFileByFileId(fileId);

    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename=${filename}`,
    });

    buffer.pipe(res);
  }
}
