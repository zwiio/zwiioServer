import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';

export class AuthPhoneRequestOtpDto {
  @ApiProperty({
    example: '+260971234567',
    description: 'Phone number in E.164 format.',
  })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.replace(/\s+/g, '') : value,
  )
  @Matches(/^\+[1-9]\d{7,14}$/, {
    message: 'phoneNumber must use E.164 format, for example +260971234567',
  })
  phoneNumber: string;
}
