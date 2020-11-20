import { Dispatch } from 'react';
import { RESET } from '../../actionTypes';
import { ReducerAction } from '../interface';

export const eraseMessages = (dispatch: Dispatch<ReducerAction>) => {
  return (): void => {
    return dispatch({ type: RESET, payload: { text: '', username: '' } });
  };
};
