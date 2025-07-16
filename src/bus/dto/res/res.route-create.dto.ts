import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResRouteCreateDto {
  @IsString()
  @ApiProperty({
    description: '',
    type: String,
  })
  message: string = '';
}
