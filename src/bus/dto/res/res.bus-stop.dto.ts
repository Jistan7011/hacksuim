import { IsNumber, IsObject, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class IntervalMin {
  @IsNumber()
  @ApiProperty({ description: '', type: Number })
  rush_hour: number = 0;

  @IsNumber()
  @ApiProperty({ description: '', type: Number })
  normal: number = 0;

  @IsNumber()
  @ApiProperty({ description: '', type: Number })
  holiday: number = 0;
}

export class ResBusStopDto {
  @IsString()
  @ApiProperty({ description: '', type: String })
  routeId: string = '';

  @IsObject()
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
