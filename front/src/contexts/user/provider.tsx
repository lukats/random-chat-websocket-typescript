import React, { FunctionComponent, useReducer } from 'react';
import { UserContext } from './context';
import { UserReducerStateInterface } from './interface';
import userReducer from '../../reducers/user';
import PropTypes from 'prop-types';

const initialState: UserReducerStateInterface = {
  channel: '',
  username: '',
  socket: null
};

export const UserProvider: FunctionComponent = ({ children }): JSX.Element => {
  const [state, dispatch] = useReducer(userReducer, initialState);
  return (
    <UserContext.Provider value={{ dispatch, state }}>
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.any.isRequired
};
