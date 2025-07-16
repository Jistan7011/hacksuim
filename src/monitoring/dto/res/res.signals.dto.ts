import { IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResSignalsDto {
  @IsNumber()
  @ApiProperty({ description: '', type: Number })
  id: number = 0;

  @IsString()
  @ApiProperty({ description: '', type: String })
  busId: string = '';

  @IsString()
  @ApiProperty({ description: '', type: String })
  signalId: string = '';

  @IsString()
  @ApiProperty({ description: '', type: String })
  signalName: string = '';

  @IsNumber()
  @ApiProperty({ description: '', type: Number })
  signalType: number = 0;

  @IsString()
  @ApiProperty({ description: '', type: String })
  signalDescription: string = '';

  @IsString()
  @ApiProperty({ description: '', type: String })
  createdAt: string = '';
}
