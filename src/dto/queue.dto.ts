import { ApiProperty } from '@nestjs/swagger';

export class QueueDto {
  @ApiProperty()
  fullname: string;
  @ApiProperty()
  telNumber: string;
  @ApiProperty()
  lindId: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  province: string;
  @ApiProperty()
  weight: number;
  @ApiProperty()
  height: number;
}
