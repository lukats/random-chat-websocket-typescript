import { getModelForClass } from '@typegoose/typegoose';
import { UserClass } from './class';

export const User = getModelForClass(UserClass);
