import { RESET } from '../actionTypes';
import { SET_BOTH, SET_SOCKET, SET_TOKEN, SET_USERNAME } from './actionTypes';
import { setBoth, setSocket, setToken, setUsername } from './functions';
import { ReducerAction, UserState } from './interface';

export default function reducer(
  state: UserState,
  action: ReducerAction
): UserState {
  switch (action.type) {
    case SET_BOTH:
      return setBoth(state, action.payload);
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
        socket: null,
      };
    default:
      throw new Error();
  }
}
