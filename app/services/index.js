import sendCrawlData from './amqp/sendCrawlData';
import takeCommandFromCC from './amqp/takeCommand';


export default async function () {
  Promise.all([
    sendCrawlData.start(),
    takeCommandFromCC.start(),
  ]);
}
