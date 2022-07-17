import puppeteer from 'puppeteer';
import { writeFileSync } from 'fs';
import browserConfig from '../../../config/browser';
import crawlHiFleet from './hifleet-crawler';
import loggerFactory from '../logger-factory';

const logger = loggerFactory.getLogger(__filename);

export default async function crawl(listCrawlFleets) {
  logger.info({ message: `Nhận lệnh quét ${listCrawlFleets.length} tàu` });

  const browser = await puppeteer.launch(browserConfig);
  try {
    // Open chromium
    const page = await browser.newPage();

    // Click OK khi xuat hien dialog
    page.on('dialog', async (dialog) => {
      await dialog.accept();
    });

    logger.info({ message: 'Mở trình duyệt Chromium và tiến hành thu thập thông tin tàu' });
    const hifleet = await crawlHiFleet(listCrawlFleets, page);

    writeFileSync('./fleet.json', JSON.stringify(hifleet, null, 2));

    logger.info({ message: `Đã thu thập xong thông tin ${hifleet.length} tàu` });

    return hifleet;
  } catch (err) {
    logger.error({ message: err.stack || err });
  } finally {
    browser.close();
  }
  return [];
}
