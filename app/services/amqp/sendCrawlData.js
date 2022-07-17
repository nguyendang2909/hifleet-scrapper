import Publisher from './connection/publisher';
import {
  CRAWL_DATA_EXCHANGE, CRAWL_DATA_EXCHANGE_TYPE, CRAWL_DATA_ROUTING_KEY, CRAWL_DATA_TOPIC,
} from '../../../config/amqp';

export default new Publisher(
  CRAWL_DATA_EXCHANGE,
  CRAWL_DATA_EXCHANGE_TYPE,
  CRAWL_DATA_ROUTING_KEY,
  CRAWL_DATA_TOPIC,
);
