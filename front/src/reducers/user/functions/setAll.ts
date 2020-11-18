import { UserPayload, UserState } from '../interface';

export function setAll(state: UserState, payload: UserPayload) {
  const { username, token, socket } = payload;
  if (!username || !token || !socket) return { ...state };
  return { ...state, username, token, socket };
}
