import { IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResEmpInfoDto {
  @IsNumber()
  @ApiProperty({ description: '', type: Number })
  id: number = 0;

  @IsString()
  @ApiProperty({ description: '', type: String })
  name: string = '';

  @IsString()
  @ApiProperty({ description: '', type: String })
  email: string = '';

  @IsString()
  @ApiProperty({ description: '', type: String })
  phoneNumber: string = '';

  @IsString()
  @ApiProperty({ description: '', type: String })
  birthday: string = '';

  @IsString()
  @ApiProperty({ description: '', type: String })
  position: string = '';

  @IsString()
  @ApiProperty({ description: '', type: String })
  department: string = '';

  @IsString()
  @ApiProperty({ description: '', type: String })
  role: string = '';

  @IsString()
  @ApiProperty({ description: '', type: String })
  createdAt: string = '';

  @IsString()
  @ApiProperty({ description: '', type: String })
  updatedAt: string = '';
}
