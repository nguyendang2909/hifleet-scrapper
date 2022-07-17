import amqpConnection from '.';
import loggerFactory from '../../../lib/logger-factory';

const logger = loggerFactory.getLogger(__filename);

class Subscriber {
  constructor(exchange, exchangeType, queue, routingKey, handleData) {
    this.exchange = exchange;
    this.exchangeType = exchangeType;
    this.queue = queue;
    this.routingKey = routingKey;
    this.handleData = handleData;
  }

  /**
   * Bootstrap the service
   */
  start() {
    this.channel = amqpConnection.createChannel({
      name: 'basic subscribers',
      json: true,
      setup: async (channel) => {
        try {
        // Assert channel and subscribe event handler
          await channel.assertExchange(this.exchange, this.exchangeType, { durable: false });
          await channel.assertQueue(this.queue, { durable: false });
          await channel.prefetch(1);
          await channel.bindQueue(this.queue, this.exchange, this.routingKey);
          await channel.consume(this.queue, this.handleMessage.bind(this));
          logger.info({ message: `Kết nối exchange "${this.exchange}" dạng "${this.exchangeType}" liên kết queue "${this.queue}" với routingKey "${this.routingKey}"` });
        } catch (err) {
          logger.error({ message: err.stack || err });
        }
      },
    });
  }

  /**
   * Handler for message processing from those queue
   * @param {Object} msg AMQPlib message object
   * @returns {Promise|void} True when the message is sucessfully handled
   */
  async handleMessage(msg) {
    try {
      logger.info({ message: 'Nhận lệnh từ Control Center' });
      this.channel.ack(msg);
      this.handleData(msg);
    } catch (err) {
      logger.error({ message: err.stack || err });
      this.channel.ack(msg);
    }
  }
}
export default Subscriber;
