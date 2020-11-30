import { Dispatch } from 'react';
import { MessageInterface } from '../../contexts/messages/interface';
import { ReducerAction as ReducerActionFromUser } from '../user/interface';

export type MessagesState = MessageInterface[];

export interface ReducerAction {
  type: string;
  payload: MessageInterface;
}

export interface SendMessageAction {
  message: MessageInterface;
  socket: SocketIOClient.Socket;
  channel: string;
  dispatch: Dispatch<ReducerActionFromUser>;
}
