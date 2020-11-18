import { prop as ModelField } from '@typegoose/typegoose';

export class UserClass {
  @ModelField({ required: true, minlength: 1, maxlength: 30, unique: true })
  username: string;

  @ModelField({ required: true, minlength: 8 })
  password: string;

  @ModelField({ default: 0 })
  passwordCount?: number;
}
