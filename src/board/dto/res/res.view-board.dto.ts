import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResViewBoardDto {
  @IsNumber()
  @ApiProperty({ description: '', type: Number })
  id: number = 0;

  @IsString()
  @ApiProperty({ description: '', type: String })
  boardId: string = '';

  @IsString()
  @ApiProperty({ description: '', type: String })
  writerEmail: string = '';

  @IsString()
  @ApiProperty({ description: '', type: String })
  fileId: string | null = null;

  @IsNumber()
  @ApiProperty({ description: '', type: String })
  boardType: number;

  @IsString()
  @ApiProperty({ description: '', type: String })
  title: string = '';

  @IsString()
  @ApiProperty({ description: '', type: String })
  content: string = '';

  @IsString()
  @ApiProperty({ description: '', type: String })
  createdAt: string = '';

  @IsString()
  @ApiProperty({ description: '', type: String })
  updatedAt: string = '';
}
