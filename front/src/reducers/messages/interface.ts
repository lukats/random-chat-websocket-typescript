import { MessageInterface } from '../../contexts/messages/interface';

export type MessagesState = MessageInterface[];

export interface ReducerAction {
  type: string;
  payload: MessageInterface;
}
