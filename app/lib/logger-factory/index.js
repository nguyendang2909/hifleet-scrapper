import winston from './winston';

class LoggerFactory {
  constructor() {
    this.winstonLogger = winston;
  }

  getLogger(filename) {
    return this.winstonLogger(filename);
  }
}
export default new LoggerFactory();
