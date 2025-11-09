/**
 * Node modules
 */
import mongoose, { mongo } from 'mongoose';

/**
 * Custom modules
 */
import config from '@/config';
import { logger } from '@/lib/winston';

/**
 * Types
 */
import type { ConnectOptions } from 'mongoose';

const clientOptions: ConnectOptions = {
  dbName: 'accomBook',
  appName: 'AccomBook',
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  },
};

//Connecting to the database
export const connectToDatabase = async (): Promise<void> => {
  if (!config.MONGO_URI) {
    throw new Error('MongoDB URI is not defined in the configuration');
  }

  try {
    await mongoose.connect(config.MONGO_URI, clientOptions);

    logger.info('Connected to the database successfully', {
      uri: config.MONGO_URI,
      options: clientOptions,
    });
  } catch (err) {
    if (err instanceof Error) throw err;

    logger.error('Error connecting to the database', err);
  }
};

//Disconnecting from the database
export const disconnectFromDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.info('Disconnected from the database successfully', {
      uri: config.MONGO_URI,
      options: clientOptions,
    });
  } catch (err) {
    if (err instanceof Error) throw new Error(err.message);

    logger.error('Error disconnecting from the database', err);
  }
};
