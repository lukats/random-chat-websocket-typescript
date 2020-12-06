/* eslint-disable no-var */
import { Notifier } from '@airbrake/node';
import { Redis } from 'ioredis';

declare global {
  namespace NodeJS {
    interface GLobal {
      airbrake: Notifier;
      redis: Redis;
    }
  }
  var airbrake: Notifier;
  var redis: Redis;
}
