import startServices from './services';
import loggerFactory from './lib/logger-factory';

const logger = loggerFactory.getLogger(__filename);

(async () => {
  try {
    await startServices();
    logger.info({ message: 'Chương trình khởi chạy thành công' });
  } catch (err) {
    logger.error({ message: err.stack || err });
  }
})();
