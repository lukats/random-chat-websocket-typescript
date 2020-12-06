import { Dispatch } from 'react';
import { ReducerAction, UserPayload, SignAction } from '../interface';
import { decode } from 'jsonwebtoken';
import io from 'socket.io-client';

export const signUp = (dispatch: Dispatch<ReducerAction>) => {
  return async (action: SignAction): Promise<void> => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_HTTP_URL}/signup`,
        {
          method: 'POST',
          mode: 'cors',
          credentials: 'include',
          body: JSON.stringify({
            username: action.payload.username,
            password: window.btoa(
              unescape(encodeURIComponent(action.payload.password))
            )
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      if (res.status !== 200) throw new Error(`${res.status}`);

      const { token, username } = (await res.json()) as UserPayload;
      const clearToken = decodeURIComponent(escape(window.atob(`${token}`)));
      const decodedToken = decode(clearToken);
      if (!decodedToken || typeof decodedToken === 'string')
        throw new Error('Invalid token');
      const socket = io(
        `${process.env.REACT_APP_BACKEND_WS_URL}/?channel=${decodedToken.channel}`,
        { transports: ['websocket'], upgrade: false }
      );
      const newAction = {
        type: action.type,
        payload: { channel: `${decodedToken.channel}`, username, socket }
      };
      dispatch(newAction);
      action.replace('/chat');
    } catch (error) {
      return;
    }
  };
};
