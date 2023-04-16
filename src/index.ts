import { app } from './app';
import { connectMongoDB } from './config/mongo';
import { redisClient } from './config/redisConfig';
import logger from './logger';

const start = async () => {
  await connectMongoDB();
  await redisClient.connect() 
  app.listen(3000, () => {
    logger.info('🚀 listening on port 3000');
  });
};

start();
