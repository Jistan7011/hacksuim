import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class ReqDownloadDto {
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @ApiProperty({ description: '', type: String })
  filename: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @ApiProperty({ description: '', type: String })
  originFilename: string;
}
