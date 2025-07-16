import { IsArray, ValidateNested, IsString, IsNumber, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class BusRealtimeRouteStatistics {
  @IsString()
  @ApiProperty({ description: '', type: String })
  brtusId: string = '';

  @IsString()
  @ApiProperty({ description: '', type: String })
  busNumber: string = '';

  @IsString()
  @ApiProperty({ description: '', type: String })
  recordDatetime: string = '';

  @IsNumber()
  @ApiProperty({ description: '', type: Number })
  userCount: number = 0;

  @IsObject()
  @ApiProperty({ description: '' })
  stopDistribution: Record<string, number> = {};

  @IsString()
  @ApiProperty({ description: '', type: String })
  createdAt: string = '';
}

class BusPassengersStatistics {
  @IsString()
  @ApiProperty({ description: '', type: String })
  date: string = '';

  @IsArray()
  @IsNumber({}, { each: true })
  @ApiProperty({ description: '', type: Number, isArray: true })
  data: number[] = [];
}

class BusOccupancyRateStatistics {
  @IsString()
  @ApiProperty({ description: '', type: String })
  date: string = '';

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ description: '', type: String, isArray: true })
  data: string[] = [];
}

class BusArrivalRateStatistics {
  @IsString()
  @ApiProperty({ description: '', type: String })
  date: string = '';

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ description: '', type: String, isArray: true })
  data: string[] = [];
}

class BusBatteryInfoStatistics {
  @IsString()
  @ApiProperty({ description: '', type: String })
  busNumber: string = '';

  @IsString()
  @ApiProperty({ description: '', type: Number })
  busBattery: number = 0;
}

class BusIntegrateStatistics {
  @IsString()
  @ApiProperty({ description: '', type: String })
  busNumber: string = '';

  @IsString({ each: true })
  @ApiProperty({ description: '', type: String, isArray: true })
  stops: string[] = [];

  @IsString({ each: true })
  @ApiProperty({ description: '', type: String, isArray: true })
  intervalMin: string[] = [];

  @IsString()
  @ApiProperty({ description: '', type: String })
  firstBus: string = '';

  @IsString()
  @ApiProperty({ description: '', type: String })
  lastBus: string = '';

  @IsNumber()
  @ApiProperty({ description: '', type: Number })
  busStatus: number = 0;
}

export class ResStatisticsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BusRealtimeRouteStatistics)
  @ApiProperty({ description: '', type: BusRealtimeRouteStatistics, isArray: true })
  busRealtimeRouteStatistics: BusRealtimeRouteStatistics[] = new Array<BusRealtimeRouteStatistics>();

  @IsObject()
  @ValidateNested()
  @Type(() => BusPassengersStatistics)
  @ApiProperty({ description: '', type: BusPassengersStatistics })
  busPassengersStatistics: BusPassengersStatistics = new BusPassengersStatistics();

  @IsObject()
  @ValidateNested()
  @Type(() => BusOccupancyRateStatistics)
  @ApiProperty({ description: '', type: BusOccupancyRateStatistics })
  busOccupancyRateStatistics: BusOccupancyRateStatistics = new BusOccupancyRateStatistics();

  @IsObject()
  @ValidateNested()
  @Type(() => BusArrivalRateStatistics)
  @ApiProperty({ description: '', type: BusArrivalRateStatistics })
  busArrivalRateStatistics: BusArrivalRateStatistics = new BusArrivalRateStatistics();

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BusBatteryInfoStatistics)
  @ApiProperty({ description: '', type: BusBatteryInfoStatistics, isArray: true })
  busBatteryInfoStatistics: BusBatteryInfoStatistics[] = new Array<BusBatteryInfoStatistics>();

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BusIntegrateStatistics)
  @ApiProperty({ description: '', type: BusIntegrateStatistics, isArray: true })
  busIntegrateStatistics: BusIntegrateStatistics[] = new Array<BusIntegrateStatistics>();
}
