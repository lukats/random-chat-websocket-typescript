import {
  modelOptions,
  prop as ModelField,
  Severity
} from '@typegoose/typegoose';

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class ChannelClass {
  @ModelField({ required: true, unique: true })
  name: string;

  @ModelField({ required: true })
  users: string[];
}
