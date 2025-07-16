import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsDefined,
  IsNotEmpty,
  IsIn,
  IsNumberString,
  Matches,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';

const VALID_SIGNAL_TYPES = ['normal', 'warning', 'error'] as const;
const VALID_SORTING = ['ASC', 'DESC'] as const;

export class ReqSignalsDto {
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @IsIn(VALID_SIGNAL_TYPES, {
    message: 'signalType must be one of normal, warning, or error',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @ApiProperty({ description: 'Signal type filter', enum: VALID_SIGNAL_TYPES })
  signalType: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @IsIn(VALID_SORTING, {
    message: 'sorting must be either "ASC" or "DESC"',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toUpperCase() : value))
  @ApiProperty({ description: 'Sort direction', enum: VALID_SORTING })
  sorting: string;

  @IsOptional()
  @IsNumberString({}, { message: 'limit must be a positive integer string' })
  @Matches(/^[1-9]\d*$/, { message: 'limit must be a positive integer string' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @ApiProperty({ description: 'Maximum number of records (as string)', required: false })
  limit?: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @Matches(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, {
    message: 'startDate must be in YYYY-MM-DD format',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @ApiProperty({ description: 'Start date (YYYY-MM-DD)' })
  startDate: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @Matches(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, {
    message: 'endDate must be in YYYY-MM-DD format',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @ApiProperty({ description: 'End date (YYYY-MM-DD)' })
  endDate: string;
}

export class ReqSignalsByBusNumberDto {
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @ApiProperty({ description: 'Bus number identifier' })
  busNumber: string;
}
