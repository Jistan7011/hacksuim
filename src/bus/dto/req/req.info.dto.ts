import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumberString, IsOptional, IsNotEmpty, IsDefined } from 'class-validator';
import { Transform } from 'class-transformer';

export class ReqInfoDto {
  @IsString()
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @ApiProperty({
    description: '',
    type: String,
  })
  busNumber: string;

  @IsNumberString()
  @IsDefined()
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @ApiProperty({
    description: '',
    type: String,
  })
  busStatus: string;
}
