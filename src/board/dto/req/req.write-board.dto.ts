import { Transform } from 'class-transformer';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReqWriteBoardDto {
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @ApiProperty({ type: String, description: '' })
  writerEmail: string;

  @IsString()
  @IsDefined()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @ApiProperty({ type: String, description: '' })
  fileId: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @ApiProperty({ type: String, description: '' })
  boardType: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @ApiProperty({ type: String, description: '' })
  title: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @ApiProperty({ type: String, description: '' })
  content: string;
}
