export interface UserReducerStateInterface {
  token: string;
  username: string;
  socket: Object | null;
}

export interface UserContextInterface {
  state: UserReducerStateInterface;
  reducer: Function;
}
