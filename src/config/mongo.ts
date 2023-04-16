import mongoose from 'mongoose';
import logger from '../logger';
import config from './serverConfig'
const { MONGO_HOST, MONGO_PORT, MONGO_USERNAME, MONGO_PASSWORD, MONGO_DB_NAME ,MONGO_URL} = config

const connectMongoDB = async () => {
  const connectionString =  MONGO_URL|| getConnectionString();

  mongoose.set('strictQuery', false);
  await mongoose.connect(connectionString);

  mongoose.connection.on('error', (err) => {
    logger.error('❌ mongoose connection error', err);
  });
  mongoose.connection.on('connected', () => {
    logger.info('✅ mongoose is connected');
  });
};

const getConnectionString = () => {
  if (!MONGO_HOST) {
    throw new Error('💡 MONGO_HOST must be defined!..');
  }
  if (!MONGO_PORT) {
    throw new Error('💡 MONGO_PORT must be defined!..');
  }
  if (!MONGO_USERNAME) {
    throw new Error('💡 MONGO_USERNAME must be defined!..');
  }
  if (!MONGO_PASSWORD) {
    throw new Error('💡 MONGO_PASSWORD must be defined!..');
  }
  const username = encodeURIComponent(MONGO_USERNAME);
  const password = encodeURIComponent(MONGO_PASSWORD);

  const connectionString = `mongodb://${username}:${password}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB_NAME}`;
  return connectionString;
};

export { connectMongoDB };
