import app from './app';
import { env } from './config/environment';
import { logger } from './utils/logger';

const startServer = () => {
  try {
    app.listen(env.PORT, () => {
      logger.info(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
      logger.info(`API: http://localhost:${env.PORT}/api/v1`);
      logger.info(`Health: http://localhost:${env.PORT}/api/v1/health`);
    });
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
};

startServer();