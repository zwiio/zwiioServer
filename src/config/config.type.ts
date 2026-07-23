import { AppConfig } from './app-config.type';
import { AuthConfig } from '../auth/config/auth-config.type';
import { DatabaseConfig } from '../database/config/database-config.type';
import { FileConfig } from '../files/config/file-config.type';
import { FirebaseConfig } from '../auth/config/firebase-config.type';
import { MailConfig } from '../mail/config/mail-config.type';
import { TwilioConfig } from '../auth/config/twilio-config.type';

export type AllConfigType = {
  app: AppConfig;
  auth: AuthConfig;
  database: DatabaseConfig;
  file: FileConfig;
  firebase: FirebaseConfig;
  mail: MailConfig;
  twilio: TwilioConfig;
};
