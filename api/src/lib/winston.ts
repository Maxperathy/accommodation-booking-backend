/**
 * Node modules
 */
import winston from 'winston';

/**
 * Custom modules
 */
import config from '@/config';

const { combine, timestamp, errors, json, align, printf, colorize } =
  winston.format;

//Transport array to hold different logging transports
const transports: winston.transport[] = [];

//If application is not in production, add a console transport
if (config.NODE_ENV !== 'production') {
  transports.push(
    new winston.transports.Console({
      format: combine(
        colorize({ all: true }),
        timestamp({ format: 'YYYY-MM-DD hh:mm:ss A' }),
        align(),
        printf(({ timestamp, level, message, ...meta }) => {
          const metaStr = Object.keys(meta).length
            ? `\n ${JSON.stringify(meta)}`
            : '';

          return `${timestamp} [${level.toUpperCase()}]: ${message} ${metaStr}`;
        }),
      ),
    }),
  );
}

//Create a logger instance using winston
const logger = winston.createLogger({
  level: config.LOG_LEVEL || 'info',
  format: combine(timestamp(), errors({ stack: true }), json()),
  transports,
  silent: config.NODE_ENV === 'test',
});

export { logger };
