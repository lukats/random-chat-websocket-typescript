export interface UserPayload {
  username?: string;
  token?: string;
  socket?: Object | null;
}

export interface UserState {
  username: string;
  token: string;
  socket: Object | null;
}

export interface ReducerAction {
  type: string;
  payload: UserPayload;
}
