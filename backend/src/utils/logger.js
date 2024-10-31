import winston from 'winston';

const logger = winston.createLogger({
  // Level of messages to log
  level: 'info',

  // Format of the log messages
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),

  // Define transports (where logs are saved)
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/app.log' }),
  ],
});

export default logger;
