import { MessageInterface } from '../../contexts/messages/interface';

export type MessagesState = MessageInterface[];

export interface ReducerAction {
  type: string;
  payload: MessageInterface;
}

export interface SendMessageAction {
  message: MessageInterface;
  socket: WebSocket;
}
