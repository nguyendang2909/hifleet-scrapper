import { createLogger, format, transports } from 'winston';
import path from 'path';

const winstonLogger = (filename) => {
  const filePath = path.relative(process.cwd(), filename);
  return createLogger({
    format: format.combine(
      format.label({ label: filePath }),
      format.timestamp({
        format: 'DD/MM/YY HH:mm:ss',
      }),
      format.printf(({
        level, message, label, timestamp,
      }) => `${timestamp} [${label}] ${level}: ${message}`),
    ),
    transports: [
      new transports.File({ filename: './logs/error.log', level: 'error' }),
      new transports.Console(),
    ],
  });
};

export default winstonLogger;
