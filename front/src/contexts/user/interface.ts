import { Dispatch } from 'react';
import { ReducerAction } from '../../reducers/user/interface';

export interface UserReducerStateInterface {
  token: string;
  username: string;
  socket: WebSocket | null;
}

export interface UserContextInterface {
  state: UserReducerStateInterface;
  dispatch: Dispatch<ReducerAction>;
}
