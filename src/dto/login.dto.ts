import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    default: 'admin',
    type: String,
  })
  username: string;
  @ApiProperty({
    default: 'Dd*123456',
    type: String,
  })
  password: string;
}
