import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResWriteNoticeDto {
  @IsString()
  @ApiProperty({ description: '', type: String })
  boardId: string = '';

  @IsString()
  @ApiProperty({ description: '', type: String })
  boardType: string = '';
}
