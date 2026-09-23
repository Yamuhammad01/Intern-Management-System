import dotenv from 'dotenv';

dotenv.config();

interface Environment {
  NODE_ENV: string;
  PORT: number;
  DATABASE_URL: string;
  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_ACCESS_EXPIRES_IN: string;
  JWT_REFRESH_EXPIRES_IN: string;
  BCRYPT_SALT_ROUNDS: number;
  FRONTEND_URL: string;
  ALLOW_VERCEL_DEPLOYMENT_URLS: boolean;
  SMTP_HOST: string;
  SMTP_PORT: number;
  SMTP_USER: string;
  SMTP_PASS: string;
  SMTP_FROM: string;
}

function getEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

export const env: Environment = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000', 10),
  DATABASE_URL: getEnvVar('DATABASE_URL'),
  JWT_ACCESS_SECRET: getEnvVar('JWT_ACCESS_SECRET'),
  JWT_REFRESH_SECRET: getEnvVar('JWT_REFRESH_SECRET'),
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10),
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  // Vercel gives every deployment its own hostname in addition to the stable
  // project alias. Allowing siblings of each configured `*.vercel.app` origin keeps
  // preview/deployment URLs working, but also trusts any other Vercel project whose
  // name happens to start with the same prefix (project names are not reserved).
  // Set to "false" to allow only the exact origins listed in FRONTEND_URL.
  ALLOW_VERCEL_DEPLOYMENT_URLS:
    (process.env.ALLOW_VERCEL_DEPLOYMENT_URLS || 'true').toLowerCase() !== 'false',
  SMTP_HOST: process.env.SMTP_HOST || '',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  SMTP_FROM: process.env.SMTP_FROM || 'noreply@internmanagement.com',
};