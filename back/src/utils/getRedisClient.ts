import { getEnv } from '../env';
import * as Redis from 'ioredis';

export const getRedisClient = (): Redis.Redis => {
  const appEnv = getEnv(process.env);
  if (appEnv == null) throw new Error('No environment provided');
  const redis = new Redis(appEnv.REDIS_URL);
  return redis;
};
