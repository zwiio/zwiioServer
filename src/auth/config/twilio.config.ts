import { registerAs } from '@nestjs/config';
import { IsString } from 'class-validator';
import validateConfig from '../../utils/validate-config';
import { TwilioConfig } from './twilio-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  TWILIO_ACCOUNT_SID: string;

  @IsString()
  TWILIO_AUTH_TOKEN: string;

  @IsString()
  TWILIO_VERIFY_SERVICE_SID: string;
}

export default registerAs<TwilioConfig>('twilio', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    verifyServiceSid: process.env.TWILIO_VERIFY_SERVICE_SID,
  };
});
