const isDev = process.env.NODE_ENV === 'development';

export const logger = {
  info: (message: string, meta?: unknown) => {
    if (isDev) {
      console.log(`[INFO] ${new Date().toISOString()} - ${message}`, meta ?? '');
    }
  },
  warn: (message: string, meta?: unknown) => {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, meta ?? '');
  },
  error: (message: string, meta?: unknown) => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, meta ?? '');
  },
  debug: (message: string, meta?: unknown) => {
    if (isDev) {
      console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`, meta ?? '');
    }
  },
};