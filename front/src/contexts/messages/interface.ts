import { Dispatch } from 'react';
import { ReducerAction } from '../../reducers/messages/interface';

export interface MessageInterface {
  text: string;
  username: string;
}

export interface MessagesContextInterface {
  state: MessageInterface[];
  dispatch: Dispatch<ReducerAction>;
}
