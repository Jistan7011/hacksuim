import { Transform } from 'class-transformer';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReqViewBoardDto {
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @ApiProperty({
    description: '',
    type: String,
  })
  boardId: string;
}
