import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ResFileInfoDto {
  @IsString()
  @ApiProperty({ type: String, description: '' })
  fileId: string = '';

  @IsString()
  @ApiProperty({ type: String, description: '' })
  originFilename: string = '';

  @IsString()
  @ApiProperty({ type: String, description: '' })
  hashedFilename: string = '';

  @IsString()
  @ApiProperty({ type: String, description: '' })
  fileMimetype: string = '';

  @IsString()
  @ApiProperty({ type: String, description: '' })
  fileExt: string = '';

  @IsNumber()
  @ApiProperty({ type: Number, description: '' })
  fileSize: number = 0;

  @IsString()
  @ApiProperty({ type: Number, description: '' })
  path: string = '';

  @IsString()
  @ApiProperty({ type: String, description: '' })
  createdAt: string = '';
}
