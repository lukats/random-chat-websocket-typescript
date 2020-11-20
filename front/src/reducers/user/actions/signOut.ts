import { Dispatch } from 'react';
import { RESET } from '../../actionTypes';
import { ReducerAction } from '../interface';

export const signOut = (dispatch: Dispatch<ReducerAction>) => {
  return async (action: { socket: WebSocket }): Promise<void> => {
    try {
      await fetch(`${process.env.REACT_APP_BACKEND_HTTP_URL}/logout`);
      action.socket.close();
      return dispatch({ type: RESET, payload: {} });
    } catch (error) {
      return;
    }
  };
};
