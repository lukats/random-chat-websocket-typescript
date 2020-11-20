import { Dispatch } from 'react';
import { ADD_MESSAGE } from '../actionTypes';
import { ReducerAction } from '../interface';

export const receiveMessage = (dispatch: Dispatch<ReducerAction>) => {
  return (action: MessageEvent): void => {
    try {
      const decodedMessage = JSON.parse(
        decodeURIComponent(escape(window.atob(action.data)))
      );
      const newAction = {
        type: ADD_MESSAGE,
        payload: decodedMessage
      };
      return dispatch(newAction);
    } catch (error) {
      return;
    }
  };
};
