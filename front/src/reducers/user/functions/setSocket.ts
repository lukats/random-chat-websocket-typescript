import { UserPayload, UserState } from '../interface';

export function setSocket(state: UserState, payload: UserPayload) {
  const { socket } = payload;
  if (!socket) return { ...state };
  return { ...state, socket };
}
