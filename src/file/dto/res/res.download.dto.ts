import { ApiProperty } from '@nestjs/swagger';

export class ResDownloadDto {
  @ApiProperty({
    type: String,
    format: 'binary',
    description: '',
  })
  file: any;
}
