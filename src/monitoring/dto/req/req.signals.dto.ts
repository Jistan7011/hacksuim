import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString, IsNumberString, IsNotEmpty, Matches, IsOptional, IsNumber, IsDefined } from 'class-validator';
import { Expose, Transform } from 'class-transformer';

export class ReqSignalsDto {
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsIn(['normal', 'warning', 'error'], {
    message: 'signal_type은 normal, warning, error 중 하나여야 합니다.',
  })
  @ApiProperty({
    description: '',
    type: String,
  })
  signalType: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @ApiProperty({
    description: '',
    type: String,
  })
  sorting: string;

  @IsOptional()
  @IsNumberString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @ApiProperty({
    description: '',
    type: String,
  })
  limit: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @Matches(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, { message: 'date는 YYYY-MM-DD 형식이어야 합니다.' })
  @ApiProperty({
    description: '',
    type: String,
  })
  startDate: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @Matches(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, { message: 'date는 YYYY-MM-DD 형식이어야 합니다.' })
  @ApiProperty({
    description: '',
    type: String,
  })
  endDate: string;
}

export class ReqSignalsByBusNumberDto {
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @ApiProperty({
    description: '',
    type: String,
  })
  busNumber: string;
}
