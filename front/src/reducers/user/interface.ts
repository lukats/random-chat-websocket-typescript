export interface UserPayload {
  username?: string;
  token?: string;
  socket?: WebSocket | null;
}

export interface UserSignPayload {
  username: string;
  password: string;
}

export interface UserState {
  username: string;
  token: string;
  socket: WebSocket | null;
}

export interface ReducerAction {
  type: string;
  payload: UserPayload;
}

export interface SignAction {
  type: string;
  payload: UserSignPayload;
}
