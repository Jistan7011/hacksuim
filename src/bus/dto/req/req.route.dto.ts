import { IsDefined, IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ReqRouteDto {
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @ApiProperty({
    description: '조회할 버스 번호',
    type: String,
  })
  busNumber: string;
}
