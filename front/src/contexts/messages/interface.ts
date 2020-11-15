export interface MessageInterface {
  text: string;
  user: string;
}

export interface MessagesContextInterface {
  state: MessageInterface[];
  reducer: Function;
}
