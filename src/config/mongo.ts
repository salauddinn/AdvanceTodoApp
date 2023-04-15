import mongoose from 'mongoose';
import logger from '../logger';
import config from './serverConfig'

const connectMongoDB = async () => {
  const connectionString = getConnectionString();

  mongoose.set('strictQuery', false);
  await mongoose.connect(connectionString);

  mongoose.connection.on('error', (err) => {
    logger.error('❌ mongoose connection error', err);
  });
  mongoose.connection.on('connected', () => {
    logger.info('✅ mongoose is connected');
  });
};
const { MONGO_HOST, MONGO_PORT, MONGO_USERNAME, MONGO_PASSWORD,MONGO_DB_NAME } = config

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
  console.log(connectionString,"---");
  return connectionString;
};

export { connectMongoDB };
