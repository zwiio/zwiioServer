import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthProvidersEnum } from './auth-providers.enum';
import { RoleEnum } from '../roles/roles.enum';
import { StatusEnum } from '../statuses/statuses.enum';
import { User } from '../users/domain/user';

describe('AuthService phone OTP login', () => {
  const phoneNumber = '+260971234567';
  const user = {
    id: 'user-id',
    email: null,
    phoneNumber,
    phoneVerifiedAt: new Date(),
    provider: AuthProvidersEnum.phone,
    firstName: null,
    lastName: null,
    role: { id: RoleEnum.user },
    status: { id: StatusEnum.active },
  } as User;

  const jwtService = {
    signAsync: jest.fn(),
  };
  const usersService = {
    findByPhoneNumber: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
  const sessionService = {
    create: jest.fn(),
  };
  const configService = {
    getOrThrow: jest.fn((key: string) => {
      const config = {
        'auth.expires': '15m',
        'auth.secret': 'jwt-secret',
        'auth.refreshSecret': 'refresh-secret',
        'auth.refreshExpires': '30d',
      };

      return config[key];
    }),
  };
  const twilioVerifyService = {
    sendSmsVerification: jest.fn(),
    isVerificationApproved: jest.fn(),
  };

  let service: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AuthService(
      jwtService as never,
      usersService as never,
      sessionService as never,
      {} as never,
      configService as never,
      twilioVerifyService as never,
    );
  });

  it('should request an SMS verification code from Twilio', async () => {
    await service.requestPhoneOtp(phoneNumber);

    expect(twilioVerifyService.sendSmsVerification).toHaveBeenCalledWith(
      phoneNumber,
    );
  });

  it('should create a verified phone user and application session after approval', async () => {
    twilioVerifyService.isVerificationApproved.mockResolvedValue(true);
    usersService.findByPhoneNumber.mockResolvedValue(null);
    usersService.create.mockResolvedValue(user);
    sessionService.create.mockResolvedValue({ id: 'session-id' });
    jwtService.signAsync
      .mockResolvedValueOnce('access-token')
      .mockResolvedValueOnce('refresh-token');

    const result = await service.validatePhoneOtp({
      phoneNumber,
      code: '123456',
    });

    expect(usersService.create).toHaveBeenCalledWith(
      expect.objectContaining({
        phoneNumber,
        provider: AuthProvidersEnum.phone,
        status: { id: StatusEnum.active },
      }),
    );
    expect(sessionService.create).toHaveBeenCalledWith(
      expect.objectContaining({ user }),
    );
    expect(result).toMatchObject({
      token: 'access-token',
      refreshToken: 'refresh-token',
      user,
    });
  });

  it('should not establish a session when Twilio rejects the code', async () => {
    twilioVerifyService.isVerificationApproved.mockResolvedValue(false);

    await expect(
      service.validatePhoneOtp({ phoneNumber, code: '000000' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    expect(usersService.findByPhoneNumber).not.toHaveBeenCalled();
    expect(sessionService.create).not.toHaveBeenCalled();
  });
});
