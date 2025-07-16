import { IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class IntervalMin {
  @IsNumber()
  @ApiProperty({ description: '', type: Number })
  rushHour: number = 0;

  @IsNumber()
  @ApiProperty({ description: '', type: Number })
  normal: number = 0;

  @IsNumber()
  @ApiProperty({ description: '', type: Number })
  holiday: number = 0;
}

export class ResRouteDto {
  @IsString()
  @ApiProperty({ description: '', type: String })
  busNumber: string = '';

  @IsNumber()
  @ApiProperty({ description: '', type: Number })
  busStatus: number = 0;

  @IsString()
  @ApiProperty({ description: '', type: String })
  routeId: string = '';

  @IsString({ each: true })
  @Type(() => IntervalMin)
  @ApiProperty({ description: '', type: IntervalMin })
  intervalMin: IntervalMin = new IntervalMin();

  @IsString()
  @ApiProperty({ description: '', type: String })
  origin: string = '';

  @IsString()
  @ApiProperty({ description: '', type: String })
  destination: string = '';

  @IsString({ each: true })
  @ApiProperty({ description: '', type: String, isArray: true })
  stops: string[] = [];

  @IsString()
  @ApiProperty({ description: '', type: String })
  firstBus: string = '';

  @IsString()
  @ApiProperty({ description: '', type: String })
  lastBus: string = '';

  @IsString({ each: true })
  @ApiProperty({ description: '', type: String, isArray: true })
  timetableWeekday: string[] = [];

  @IsString({ each: true })
  @ApiProperty({ description: '', type: String, isArray: true })
  timetableHoliday: string[] = [];

  @IsString()
  @ApiProperty({ description: '', type: String })
  remarks: string = '';
}
