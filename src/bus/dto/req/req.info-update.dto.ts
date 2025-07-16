import { IsOptional, IsString, IsNotEmpty, IsNumber, IsDefined } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class ReqInfoUpdateDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty({ description: '', type: Number })
  busStatus: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ description: '', type: Number })
  busBattery: number;
}

export class ReqInfoUpdateByBusNumberDto {
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
