import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ResSigninDto {
  @IsString()
  @ApiProperty({ description: '로그인 결과', type: String })
  message: string = '';
}
