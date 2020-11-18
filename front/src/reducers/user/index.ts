import { RESET } from '../actionTypes';
import { SET_ALL, SET_SOCKET, SET_TOKEN, SET_USERNAME } from './actionTypes';
import { setAll, setSocket, setToken, setUsername } from './functions';
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
    case SET_TOKEN:
      return setToken(state, action.payload);
    case SET_SOCKET:
      return setSocket(state, action.payload);
    case RESET:
      return {
        token: '',
        username: '',
        socket: null
      };
    default:
      throw new Error();
  }
}
