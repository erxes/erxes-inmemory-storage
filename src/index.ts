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
};

export let client;

export const init = (options: IOptions) => {
  if (options.host) {
    client = redisClient;

    const retryStrategy = retryOptions => Math.max(retryOptions.attempt * 100, 3000);

    redisClient.init(redis.createClient({
      host: options.host,
      port: options.port,
      password: options.password,
      connect_timeout: options.timeout || 15000,
      enable_offline_queue: options.enableOfflineQueue || true,
      retry_unfulfilled_commands: options.retryUnfulfilledCommands || true,
      retry_strategy: options.retryStrategy || retryStrategy
    }));
  } else {
    client = memoryClient;
  }
};