import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { cert, getApps, initializeApp, type App } from 'firebase-admin/app';
import { getAuth, type Auth, type DecodedIdToken } from 'firebase-admin/auth';
import { AllConfigType } from '../config/config.type';

@Injectable()
export class FirebaseAuthService {
  private readonly auth: Auth | null;

  constructor(configService: ConfigService<AllConfigType>) {
    const projectId = configService.get('firebase.projectId', { infer: true });
    const clientEmail = configService.get('firebase.clientEmail', {
      infer: true,
    });
    const privateKey = configService.get('firebase.privateKey', {
      infer: true,
    });

    if (!projectId) {
      this.auth = null;
      return;
    }

    const app = this.getOrInitializeApp({
      projectId,
      clientEmail,
      privateKey,
    });

    this.auth = getAuth(app);
  }

  async verifyIdToken(idToken: string): Promise<DecodedIdToken> {
    if (!this.auth) {
      throw new UnauthorizedException({
        errors: {
          firebase: 'notConfigured',
        },
      });
    }

    try {
      return await this.auth.verifyIdToken(idToken);
    } catch {
      throw new UnauthorizedException({
        errors: {
          idToken: 'invalid',
        },
      });
    }
  }

  private getOrInitializeApp(config: {
    projectId: string;
    clientEmail?: string;
    privateKey?: string;
  }): App {
    const appName = 'zwiio-firebase-admin';
    const existingApp = getApps().find((app) => app.name === appName);

    if (existingApp) {
      return existingApp;
    }

    if (config.clientEmail && config.privateKey) {
      return initializeApp(
        {
          credential: cert({
            projectId: config.projectId,
            clientEmail: config.clientEmail,
            privateKey: config.privateKey,
          }),
          projectId: config.projectId,
        },
        appName,
      );
    }

    return initializeApp(
      {
        projectId: config.projectId,
      },
      appName,
    );
  }
}
