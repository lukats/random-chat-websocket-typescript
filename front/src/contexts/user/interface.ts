import { Dispatch } from 'react';
import { ReducerAction } from '../../reducers/user/interface';

export interface UserReducerStateInterface {
  channel: string;
  username: string;
  socket: SocketIOClient.Socket | null;
}

export interface UserContextInterface {
  state: UserReducerStateInterface;
  dispatch: Dispatch<ReducerAction>;
}
