import { IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResInfoDto {
  @IsString()
  @ApiProperty({ description: '', type: String })
  busNumber: string = '';

  @IsNumber()
  @ApiProperty({ description: '', type: Number })
  busStatus: number = 0;

  @IsNumber()
  @ApiProperty({ description: '', type: Number })
  busBattery: number = 0;
}
