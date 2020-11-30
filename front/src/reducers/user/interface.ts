export interface UserPayload {
  username?: string;
  channel?: string;
  token?: string;
  socket?: SocketIOClient.Socket | null;
}

export interface UserSignPayload {
  username: string;
  password: string;
}

export interface UserState {
  username: string;
  channel: string;
  socket: SocketIOClient.Socket | null;
}

export interface ReducerAction {
  type: string;
  payload: UserPayload;
}

export interface SignAction {
  type: string;
  payload: UserSignPayload;
  replace: (path: string) => void;
}
