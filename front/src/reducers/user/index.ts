import { RESET } from '../actionTypes';
import { SET_ALL, SET_CHANNEL, SET_SOCKET, SET_USERNAME } from './actionTypes';
import { setAll, setSocket, setChannel, setUsername } from './functions';
import { ReducerAction, UserState } from './interface';

export * from './actions';

export default function reducer(
  state: UserState,
  action: ReducerAction
): UserState {
  switch (action.type) {
    case SET_ALL:
      return setAll(state, action.payload);
    case SET_USERNAME:
      return setUsername(state, action.payload);
    case SET_CHANNEL:
      return setChannel(state, action.payload);
    case SET_SOCKET:
      return setSocket(state, action.payload);
    case RESET:
      return {
        channel: '',
        username: '',
        socket: null
      };
    default:
      throw new Error();
  }
}
