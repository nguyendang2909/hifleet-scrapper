import crawl from '../crawler';
import sendCrawlData from '../../services/amqp/sendCrawlData';

export default async function handleCommand(msg) {
  const listFleets = JSON.parse(msg.content.toString());
  const crawlData = await crawl(listFleets);
  if (crawlData && crawlData.length !== 0) sendCrawlData.sendMessage(crawlData);
}
