import React, { useReducer } from 'react';
import { FunctionComponent } from 'react';
import { MessageInterface } from './interface';
import messagesReducer from '../../reducers/messages';
import { MessagesContext } from './context';

const initialState: MessageInterface[] = [];

export const MessagesProvider: FunctionComponent = ({
  children
}): JSX.Element => {
  const [state, dispatch] = useReducer(messagesReducer, initialState);
  return (
    <MessagesContext.Provider value={{ state, dispatch }}>
      {children}
    </MessagesContext.Provider>
  );
};

MessagesProvider.propTypes = {
  children: React.Children
};
