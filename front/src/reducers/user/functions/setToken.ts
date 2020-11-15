import { UserPayload, UserState } from '../interface';

export function setToken(state: UserState, payload: UserPayload) {
  const { token } = payload;
  if (!token) return { ...state };
  return { ...state, token };
}
