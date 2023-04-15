import { app } from './app';
import { connectMongoDB } from './config/mongo';
import logger from './logger';

const start = async () => {
  await connectMongoDB();

  app.listen(3000, () => {
    logger.info('🚀 listening on port 3000');
  });
};

start();
