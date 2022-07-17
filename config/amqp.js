export const RABBIT_URL = 'amqp://3center:1@192.168.120.75:5672/3center';

export const COMMAND_EXCHANGE = '3center_command_to_bot_exchange';
export const COMMAND_EXCHANGE_TYPE = 'direct';

// Fleet
export const FLEET_QUEUE = '3center_fleet_bot';
export const FLEET_ROUTING_KEY = 'fleet';

// Send crawl Data
export const CRAWL_DATA_EXCHANGE = '3center_crawl_data';
export const CRAWL_DATA_EXCHANGE_TYPE = 'direct';
export const CRAWL_DATA_ROUTING_KEY = 'crawl_data';
export const CRAWL_DATA_TOPIC = 'fleet';
