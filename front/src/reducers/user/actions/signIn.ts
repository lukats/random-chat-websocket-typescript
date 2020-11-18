import { Dispatch } from 'react';
import { ReducerAction, UserPayload, SignAction } from '../interface';
import { decode } from 'jsonwebtoken';

export const signIn = (dispatch: Dispatch<ReducerAction>) => {
  return async (action: SignAction): Promise<void> => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_HTTP_URL}/login`,
        {
          method: 'POST',
          body: JSON.stringify({
            username: action.payload.username,
            password: window.btoa(
              unescape(encodeURIComponent(action.payload.password))
            )
          }),
          headers: { 'Content-Type': 'application/json' }
        }
      );
      if (res.status !== 200) throw new Error(`${res.status}`);

      const { token, username } = (await res.json()) as UserPayload;
      const clearToken = decodeURIComponent(escape(window.atob(`${token}`)));
      const decodedToken = decode(clearToken);
      if (!decodedToken || typeof decodedToken === 'string')
        throw new Error('Invalid token');
      const socket = new WebSocket(
        `${process.env.REACT_APP_BACKEND_WS_URL}/chat/${decodedToken.channel}`
      );
      const newAction = {
        type: action.type,
        payload: { token, username, socket }
      };
      window.location.href = '/chat';
      return dispatch(newAction);
    } catch (error) {
      return;
    }
  };
};
