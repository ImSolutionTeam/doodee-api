import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    default: 'admin2',
    type: String,
  })
  username: string;
  @ApiProperty({
    default: '123456',
    type: String,
  })
  password: string;
}
