/* eslint-disable no-var */
import { Notifier } from '@airbrake/node';

declare global {
  namespace NodeJS {
    interface GLobal {
      airbrake: Notifier;
    }
  }
  var airbrake: Notifier;
}
