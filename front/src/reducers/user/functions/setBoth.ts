import { UserPayload, UserState } from '../interface';

export function setBoth(state: UserState, payload: UserPayload) {
  const { username, token } = payload;
  if (!username || !token) return { ...state };
  return { ...state, username, token };
}
