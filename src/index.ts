import * as redis from 'redis';
import * as memoryClient from './memory';
import * as redisClient from './redis';

interface IOptions {
  redisOptions?: {
    host?: string;
    port?: number;
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

    const retryStrategy = (retryOptions) => Math.max(retryOptions.attempt * 100, 3000);

    redisClient.init(redis.createClient({
      host: redisOptions.host,
      port: redisOptions.port,
      password: redisOptions.password,
      connect_timeout: redisOptions.timeout || 15000,
      enable_offline_queue: redisOptions.enableOfflineQueue || true,
      retry_unfulfilled_commands: redisOptions.retryUnfulfilledCommands || true,
      retry_strategy: redisOptions.retryStrategy || retryStrategy
    }));
  } else {
    client = memoryClient;
  }
};