import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';
import { AuthPhoneRequestOtpDto } from './auth-phone-request-otp.dto';

export class AuthPhoneVerifyOtpDto extends AuthPhoneRequestOtpDto {
  @ApiProperty({ example: '123456' })
  @Matches(/^\d{4,10}$/, {
    message: 'code must contain between 4 and 10 digits',
  })
  code: string;
}
