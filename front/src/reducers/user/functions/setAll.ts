import { UserPayload, UserState } from '../interface';

export function setAll(state: UserState, payload: UserPayload): UserState {
  const { username, channel, socket } = payload;
  if (!username || !channel || !socket) return { ...state };
  return { ...state, username, channel, socket };
}
