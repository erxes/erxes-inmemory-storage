import * as redis from 'redis';
import * as memoryClient from './memory';
import * as redisClient from './redis';

interface IOptions {
  host?: string;
  port?: number;
  password?: string;
  timeout?: number;
  enableOfflineQueue?: boolean;
  retryUnfulfilledCommands?: boolean;
  retryStrategy?: (options: any) => number;
  totalRetryTime?: number;
};

interface IDefaultOptions {
  host?: string;
  port?: number;
  password?: string;
  connect_timeout?: number;
  enable_offline_queue?: boolean;
  retry_unfulfilled_commands?: boolean;
  retry_strategy?: any;
  total_retry_time?: number;
};

export const redisOptions: IDefaultOptions  = {
  connect_timeout: 20000,
  enable_offline_queue: true,
  retry_unfulfilled_commands: true,
  retry_strategy: options => Math.max(options.attempt * 100, 3000),
  total_retry_time: 15000,
};

export let client;

export const init = (options: IOptions) => {
  if (options.host) {
    client = redisClient;

    redisOptions.host = options.host;
    redisOptions.port = options.port;
    redisOptions.password = options.password;

    if (options.timeout) {
      redisOptions.connect_timeout = options.timeout;
    }

    if (options.enableOfflineQueue) {
      redisOptions.enable_offline_queue = options.enableOfflineQueue;
    }

    if (options.retryUnfulfilledCommands) {
      redisOptions.retry_unfulfilled_commands = options.retryUnfulfilledCommands;
    }

    if (options.retryStrategy) {
      redisOptions.retry_strategy = options.retryStrategy;
    }

    if (options.totalRetryTime) {
      redisOptions.total_retry_time = options.totalRetryTime;
    }

    redisClient.init(redis.createClient(redisOptions));
  } else {
    client = memoryClient;
  }
};