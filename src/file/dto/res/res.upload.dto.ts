import { IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResUploadDto {
  @IsString()
  @ApiProperty({ description: '', type: String })
  fileId: string = '';

  @IsString()
  @ApiProperty({ description: '', type: String })
  originFilename: string = '';

  @IsString()
  @ApiProperty({ description: '', type: String })
  hashedFilename: string = '';

  @IsString()
  @ApiProperty({ description: '', type: String })
  fileExt: string = '';

  @IsString()
  @ApiProperty({ description: '', type: String })
  fileMimetype: string = '';

  @IsNumber()
  @ApiProperty({ description: '', type: Number })
  fileSize: number = 0;

  @IsString()
  @ApiProperty({ description: '', type: String })
  path: string = '';

  @IsString()
  @ApiProperty({ description: '', type: String })
  createdAt: string = '';
}
