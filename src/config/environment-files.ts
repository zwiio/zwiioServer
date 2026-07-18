const nodeEnvironment = process.env.NODE_ENV ?? 'development';

export const environmentFiles = [
  `.env.${nodeEnvironment}.local`,
  `.env.${nodeEnvironment}`,
  '.env.local',
  '.env',
];
