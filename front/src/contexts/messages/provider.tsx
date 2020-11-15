import React, { useReducer } from 'react';
import { FunctionComponent } from 'react';
import { MessageInterface } from './interface';
import messagesReducer from '../../reducers/messages';
import { MessagesContext } from './context';

const initialState: MessageInterface[] = [];

export const MessagesProvider: FunctionComponent = ({ children }) => {
  const [state, reducer] = useReducer(messagesReducer, initialState);
  return (
    <MessagesContext.Provider value={{ state, reducer }}>
      {children}
    </MessagesContext.Provider>
  );
};
