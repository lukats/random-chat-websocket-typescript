import { createContext } from 'react';
import { MessagesContextInterface } from './interface';

const contextPayload: MessagesContextInterface = {
  state: [],
  dispatch: () => {
    return;
  }
};

export const MessagesContext = createContext(contextPayload);
