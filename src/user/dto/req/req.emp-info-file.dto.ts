import { IsOptional, IsString, IsIn, Matches } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

const VALID_SORT_KEYS = [
  'id','name','email','phoneNumber',
  'birthday','position','department',
  'role','createdAt','updatedAt',
] as const;

const VALID_SORTING = ['ASC','DESC'] as const;

export class ReqEmpInfoFileDto {
  @IsOptional()
  @IsString()
  @IsIn(VALID_SORT_KEYS)
  @ApiProperty({ required: false, enum: VALID_SORT_KEYS })
  sortKey?: string;

  @IsOptional()
  @IsString()
  @IsIn(VALID_SORTING)
  @ApiProperty({ required: false, enum: VALID_SORTING })
  sorting?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d+$/, { message: 'limit must be a positive integer string' })
  @ApiProperty({ required: false, description: 'positive integer as string' })
  limit?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[\w.\-]+$/, { message: 'originFilename contains invalid characters' })
  @ApiProperty({ required: false, description: 'filename without path separators' })
  originFilename?: string;
}
