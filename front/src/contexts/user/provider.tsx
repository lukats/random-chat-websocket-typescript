import React, { FunctionComponent, useReducer } from 'react';
import { UserContext } from './context';
import { UserReducerStateInterface } from './interface';
import userReducer from '../../reducers/user';

const initialState: UserReducerStateInterface = {
  token: '',
  username: '',
  socket: null
};

export const UserProvider: FunctionComponent = ({ children }) => {
  const [state, reducer] = useReducer(userReducer, initialState);
  return (
    <UserContext.Provider value={{ reducer, state }}>
      {children}
    </UserContext.Provider>
  );
};
