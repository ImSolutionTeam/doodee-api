import { ApiProperty } from '@nestjs/swagger';

export class QueueDto {
  @ApiProperty({
    default: 'Doodee makmak',
    type: String,
  })
  fullname: string;
  @ApiProperty({
    default: '0812345678',
    type: String,
  })
  telNumber: string;
  @ApiProperty()
  lindId: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  province: string;
  @ApiProperty({
    default: 55,
    type: Number,
  })
  weight: number;
  @ApiProperty({
    default: 170,
    type: Number,
  })
  height: number;
}
