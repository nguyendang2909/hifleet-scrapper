import amqpConnection from '.';
import loggerFactory from '../../../lib/logger-factory';

const logger = loggerFactory.getLogger(__filename);

/**
 * Service
 */
class Publisher {
  constructor(exchange, exchangeType, routingKey, topic) {
    this.exchange = exchange;
    this.exchangeType = exchangeType;
    this.routingKey = routingKey;
    this.topic = topic;
  }

  /**
   * Bootstrap the service
   */
  start() {
    /**
     * @type {amqplib~Channel}
     */
    this.channel = amqpConnection.createChannel({
      name: 'publisher',
      json: true,
      setup: async (ch) => {
        try {
          /**
         * RabbitMQ Gateway exchange. we will publish message mapped into there
         */
          await ch.assertExchange(this.exchange, this.exchangeType, { durable: true });
          logger.info({ message: `Kết nối exchange "${this.exchange}" dạng "${this.exchangeType}" chủ đề  "${this.topic}" với routingKey "${this.routingKey}"` });
        } catch (err) {
          logger.error({ message: `Gặp lỗi khi đăng ký hàng đợi ${err.stack || err}` });
        }
      },
    });
  }

  /**
   * Publish a message to predefined exchange
   * @param {Object} msg AMQP message object
   * @param {string} exchangeName exchange which message will be publish
   */
  sendMessage(msg) {
    logger.info({ message: `Gửi message tới ${this.exchange} với routingKey ${this.routingKey}` });
    return this.channel.publish(this.exchange, this.routingKey, msg, {
      contentType: 'application/json',
      persistent: true,
      headers: {
        topic: this.topic,
      },
    });
  }
}

export default Publisher;
