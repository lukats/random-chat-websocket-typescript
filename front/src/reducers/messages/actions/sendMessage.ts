import { Dispatch } from 'react';
import { ADD_MESSAGE } from '../actionTypes';
import { ReducerAction, SendMessageAction } from '../interface';

export const sendMessage = (dispatch: Dispatch<ReducerAction>) => {
  return (action: SendMessageAction): void => {
    try {
      const codedMessage = window.btoa(
        unescape(encodeURIComponent(JSON.stringify(action.message)))
      );
      if (action.socket.readyState !== action.socket.OPEN)
        throw new Error('Socket not open');
      action.socket.send(codedMessage);
      const newAction = {
        type: ADD_MESSAGE,
        payload: action.message
      };
      return dispatch(newAction);
    } catch (error) {
      return;
    }
  };
};
