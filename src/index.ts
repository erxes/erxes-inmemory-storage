import * as redis from 'redis';
import * as redisClient from './redis';
import * as memoryClient from './memory';

interface IOptions {
  redisOptions?: {
    host?: string;
    port?: string;
    password?: string;
    timeout?: number;
    enableOfflineQueue?: boolean;
    retryUnfulfilledCommands?: boolean;
    retryStrategy?: (options: any) => number;
  }
};

export let client;

export const init = (options?: IOptions) => {

  const { redisOptions } = options;

  if (redisOptions.host) {
    client = redisClient;

    redisClient.init(redis.createClient(redisOptions));
  } else {
    client = memoryClient;
  }
};