import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResMyinfoDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty({ description: '', type: Number })
  id: number = 0;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '', type: String })
  email: string = '';

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '', type: String })
  phoneNumber: string = '';

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '', type: String })
  birthday: string = '';

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '', type: String })
  position: string = '';

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '', type: String })
  department: string = '';

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '', type: String })
  role: string = '';

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '', type: String })
  createdAt: string = '';

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '', type: String })
  updatedAt: string = '';
}
