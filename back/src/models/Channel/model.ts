import { getModelForClass } from '@typegoose/typegoose';
import { ChannelClass } from './class';

export const Channel = getModelForClass(ChannelClass);
