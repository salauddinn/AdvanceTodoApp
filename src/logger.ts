import winston from 'winston';
import config from './config/serverConfig'
const { combine, timestamp, label, printf, errors } = winston.format;

const SERVICE_NAME = 'Todo App Server';

const customFormat = printf(({ level, message, label, timestamp, ...meta }) => {
  let msg = `${timestamp} [${label}] ${level}: ${message} `;
  if (Object.keys(meta).length > 0) {
    msg += JSON.stringify(meta);
  }
  return msg;
});

const logLevels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
};

const logger = winston.createLogger({
  levels: logLevels,
  level: config.LOG_LEVEL || 'info',
  format: combine(errors({ stack: true }), label({ label: SERVICE_NAME }), timestamp(), customFormat),
  transports: [new winston.transports.Console()],
  exceptionHandlers: [new winston.transports.Console({ consoleWarnLevels: ['error'] })],
  rejectionHandlers: [new winston.transports.Console({ consoleWarnLevels: ['error'] })],
});

export default logger;
