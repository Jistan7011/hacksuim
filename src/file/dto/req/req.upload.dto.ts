import { ApiProperty } from '@nestjs/swagger';

export class ReqUploadDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: '',
  })
  file: any;
}
