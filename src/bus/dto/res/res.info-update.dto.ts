import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResInfoUpdateDto {
  @IsString()
  @ApiProperty({ description: '', type: String })
  message: string = '';
}
