import { UserPayload, UserState } from '../interface';

export function setChannel(state: UserState, payload: UserPayload): UserState {
  const { channel } = payload;
  if (!channel) return { ...state };
  return { ...state, channel };
}
