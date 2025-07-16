import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ResSignupDto {
  @IsString()
  @ApiProperty({ description: '회원가입 결과', type: String })
  message: string = '';
}
