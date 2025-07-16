import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class ReqSignupDto {
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
  @MinLength(6)
  @IsDefined()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @ApiProperty({
    description: '패스워드',
    example: 'this-is-password09!@',
    type: String,
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @ApiProperty({
    description: '이름',
    example: '홍길동',
    type: String,
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @ApiProperty({
    description: '전화번호',
    example: '+8210-1234-1234',
    type: String,
  })
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @ApiProperty({
    description: '생년월일',
    example: '2025-07-15',
    type: String,
  })
  birthday: string;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @ApiProperty({
    description: '포지션',
    example: '과장',
    type: String,
  })
  position: string;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @ApiProperty({
    description: '부서',
    example: '스마트시티 시설 관리팀',
    type: String,
  })
  department: string;
}
