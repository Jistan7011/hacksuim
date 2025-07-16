import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty, MinLength, IsDefined } from 'class-validator';
import { Transform } from 'class-transformer';

export class ReqSigninDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @ApiProperty({
    description: '이메일',
    example: 'park.busan@hacksium.in.busan',
    type: String,
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @MinLength(6)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @ApiProperty({
    description: '패스워드',
    example: 'this-is-password09!@',
    type: String,
  })
  password: string;
}
