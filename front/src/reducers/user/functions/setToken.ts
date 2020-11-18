import { UserPayload, UserState } from '../interface';

export function setToken(state: UserState, payload: UserPayload): UserState {
  const { token } = payload;
  if (!token) return { ...state };
  return { ...state, token };
}
