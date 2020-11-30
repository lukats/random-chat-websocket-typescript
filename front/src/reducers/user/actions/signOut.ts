import { Dispatch } from 'react';
import { RESET } from '../../actionTypes';
import { ReducerAction } from '../interface';

export const signOut = (dispatch: Dispatch<ReducerAction>) => {
  return async (action: {
    socket: SocketIOClient.Socket | null;
    replace: (path: string) => void;
  }): Promise<void> => {
    try {
      await fetch(`${process.env.REACT_APP_BACKEND_HTTP_URL}/logout`, {
        mode: 'cors',
        credentials: 'include'
      });
      if (action.socket) action.socket.close();
      action.replace('/');
      return dispatch({ type: RESET, payload: {} });
    } catch (error) {
      return;
    }
  };
};
