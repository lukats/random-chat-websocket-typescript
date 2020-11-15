import { createContext } from 'react';
import { MessagesContextInterface } from './interface';

const contextPayload: MessagesContextInterface = {
  state: [],
  reducer: () => {},
};

export const MessagesContext = createContext(contextPayload);
