import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import twilio from 'twilio';
import { AllConfigType } from '../config/config.type';

@Injectable()
export class TwilioVerifyService {
  private readonly client: ReturnType<typeof twilio>;
  private readonly serviceSid: string;

  constructor(configService: ConfigService<AllConfigType>) {
    this.client = twilio(
      configService.getOrThrow('twilio.accountSid', { infer: true }),
      configService.getOrThrow('twilio.authToken', { infer: true }),
    );
    this.serviceSid = configService.getOrThrow('twilio.verifyServiceSid', {
      infer: true,
    });
  }

  async sendSmsVerification(phoneNumber: string): Promise<void> {
    await this.client.verify.v2
      .services(this.serviceSid)
      .verifications.create({ to: phoneNumber, channel: 'sms' });
  }

  async isVerificationApproved(
    phoneNumber: string,
    code: string,
  ): Promise<boolean> {
    try {
      const verification = await this.client.verify.v2
        .services(this.serviceSid)
        .verificationChecks.create({ to: phoneNumber, code });

      return verification.status === 'approved';
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'status' in error &&
        error.status === 404
      ) {
        return false;
      }

      throw error;
    }
  }
}
