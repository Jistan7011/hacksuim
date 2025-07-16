import { IsArray, ValidateNested, IsString, IsNumber, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class BusInfoOverview {
  @IsNumber()
  @ApiProperty({ description: '', type: Number })
  operatingVehicleCount: number = 0;

  @IsNumber()
  @ApiProperty({ description: '', type: Number })
  standbyVehicleCount: number = 0;

  @IsNumber()
  @ApiProperty({ description: '', type: Number })
  faultyVehicleCount: number = 0;

  @IsNumber()
  @ApiProperty({ description: '', type: Number })
  averageBatteryLevel: number = 0;
}

class BusBatteryInfoOverview {
  @IsString()
  @ApiProperty({ description: '', type: String })
  busNumber: string = '';

  @IsNumber()
  @ApiProperty({ description: '', type: Number })
  busBattery: number = 0;
}

class BusIntegrateOverviewIntervalMin {
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

class BusIntegrateOverview {
  @IsString()
  @ApiProperty({ description: '', type: String })
  busNumber: string = '';

  @IsString({ each: true })
  @ApiProperty({ description: '', type: String, isArray: true })
  stops: string[] = [];

  @IsString({ each: true })
  @Type(() => BusIntegrateOverviewIntervalMin)
  @ApiProperty({ description: '', type: BusIntegrateOverviewIntervalMin })
  intervalMin: BusIntegrateOverviewIntervalMin = new BusIntegrateOverviewIntervalMin();

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

class BusRealtimeRouteStatisticsOverview {
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

class BusPassengersStatisticsOverview {
  @IsString()
  @ApiProperty({ description: '', type: String })
  date: string = '';

  @IsArray()
  @IsNumber({}, { each: true })
  @ApiProperty({ description: '', type: Number, isArray: true })
  data: number[] = [];
}

class BusOccupancyRateStatisticsOverview {
  @IsString()
  @ApiProperty({ description: '', type: String })
  date: string = '';

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ description: '', type: String, isArray: true })
  data: string[] = [];
}

class BusArrivalRateStatisticsOverview {
  @IsString()
  @ApiProperty({ description: '', type: String })
  date: string = '';

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ description: '', type: String, isArray: true })
  data: string[] = [];
}

class BusSuccessSignalStatisticsOverview {
  @IsNumber()
  @ApiProperty({ description: '', type: Number })
  current: number = 0;

  @IsNumber()
  @ApiProperty({ description: '', type: Number })
  previous: number = 0;

  @IsString()
  @ApiProperty({ description: '', type: String })
  average: string = '';
}

class BusWarningSignalStatisticsOverview {
  @IsNumber()
  @ApiProperty({ description: '', type: Number })
  current: number = 0;

  @IsNumber()
  @ApiProperty({ description: '', type: Number })
  previous: number = 0;

  @IsString()
  @ApiProperty({ description: '', type: String })
  average: string = '';
}

class BusErrorSignalStatisticsOverview {
  @IsNumber()
  @ApiProperty({ description: '', type: Number })
  current: number = 0;

  @IsNumber()
  @ApiProperty({ description: '', type: Number })
  previous: number = 0;

  @IsString()
  @ApiProperty({ description: '', type: String })
  average: string = '';
}

class BusSignalStatisticsOverview {
  @IsObject()
  @ValidateNested()
  @Type(() => BusSuccessSignalStatisticsOverview)
  @ApiProperty({ description: '', type: BusSuccessSignalStatisticsOverview })
  successSignal: BusSuccessSignalStatisticsOverview = new BusSuccessSignalStatisticsOverview();

  @IsObject()
  @ValidateNested()
  @Type(() => BusWarningSignalStatisticsOverview)
  @ApiProperty({ description: '', type: BusWarningSignalStatisticsOverview })
  warningSignal: BusWarningSignalStatisticsOverview = new BusWarningSignalStatisticsOverview();

  @IsObject()
  @ValidateNested()
  @Type(() => BusErrorSignalStatisticsOverview)
  @ApiProperty({ description: '', type: BusErrorSignalStatisticsOverview })
  errorSignal: BusErrorSignalStatisticsOverview = new BusErrorSignalStatisticsOverview();
}

export class ResDashboardDto {
  @IsObject()
  @ValidateNested()
  @Type(() => BusInfoOverview)
  @ApiProperty({ description: '', type: BusInfoOverview })
  busInfoOverview: BusInfoOverview = new BusInfoOverview();

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BusBatteryInfoOverview)
  @ApiProperty({ description: '', type: BusBatteryInfoOverview, isArray: true })
  busBatteryInfoOverview: BusBatteryInfoOverview[] = new Array<BusBatteryInfoOverview>();

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BusIntegrateOverview)
  @ApiProperty({ description: '', type: BusIntegrateOverview, isArray: true })
  busIntegrateOverview: BusIntegrateOverview[] = new Array<BusIntegrateOverview>();

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BusRealtimeRouteStatisticsOverview)
  @ApiProperty({ description: '', type: BusRealtimeRouteStatisticsOverview, isArray: true })
  busRealtimeRouteStatisticsOverview: BusRealtimeRouteStatisticsOverview[] = new Array<BusRealtimeRouteStatisticsOverview>();

  @IsObject()
  @ValidateNested()
  @Type(() => BusPassengersStatisticsOverview)
  @ApiProperty({ description: '', type: BusPassengersStatisticsOverview })
  busPassengersStatisticsOverview: BusPassengersStatisticsOverview = new BusPassengersStatisticsOverview();

  @IsObject()
  @ValidateNested()
  @Type(() => BusOccupancyRateStatisticsOverview)
  @ApiProperty({ description: '', type: BusOccupancyRateStatisticsOverview })
  busOccupancyRateStatisticsOverview: BusOccupancyRateStatisticsOverview = new BusOccupancyRateStatisticsOverview();

  @IsObject()
  @ValidateNested()
  @Type(() => BusArrivalRateStatisticsOverview)
  @ApiProperty({ description: '', type: BusArrivalRateStatisticsOverview })
  busArrivalRateStatisticsOverview: BusArrivalRateStatisticsOverview = new BusArrivalRateStatisticsOverview();

  @IsObject()
  @ValidateNested()
  @Type(() => BusSignalStatisticsOverview)
  @ApiProperty({ description: '', type: BusSignalStatisticsOverview })
  busSignalStatisticsOverview: BusSignalStatisticsOverview = new BusSignalStatisticsOverview();
}
