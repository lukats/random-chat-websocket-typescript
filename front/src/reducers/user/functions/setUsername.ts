import { UserPayload, UserState } from '../interface';

export function setUsername(state: UserState, payload: UserPayload) {
  const { username } = payload;
  if (!username) return { ...state };
  return { ...state, username };
}
