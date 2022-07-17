import Subscriber from './connection/subscriber';
import {
  COMMAND_EXCHANGE, COMMAND_EXCHANGE_TYPE, FLEET_QUEUE, FLEET_ROUTING_KEY,
} from '../../../config/amqp';
import handleCommand from '../../lib/handlerCommand';

export default new Subscriber(
  COMMAND_EXCHANGE,
  COMMAND_EXCHANGE_TYPE,
  FLEET_QUEUE,
  FLEET_ROUTING_KEY,
  handleCommand,
);
