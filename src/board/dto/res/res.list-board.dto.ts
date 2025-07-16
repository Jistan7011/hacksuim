import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResListBoardDto {
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

  @IsString()
  @ApiProperty({ description: '', type: String })
  boardType: string = '';

  @IsString()
  @ApiProperty({ description: '', type: String })
  title: string = '';

  @IsString()
  @ApiProperty({ description: '', type: String })
  createdAt: string = '';

  @IsString()
  @ApiProperty({ description: '', type: String })
  updatedAt: string = '';
}
