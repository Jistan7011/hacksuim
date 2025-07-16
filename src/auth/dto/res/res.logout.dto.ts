import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ResLogoutDto {
  @IsString()
  @ApiProperty({ description: '로그아웃 결과', type: String })
  message: string = '';
}
