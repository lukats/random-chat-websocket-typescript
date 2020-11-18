import { createContext } from 'react';
import { UserContextInterface } from './interface';

const initialContext: UserContextInterface = {
  state: { token: '', username: '', socket: null },
  dispatch: () => {}
};

export const UserContext = createContext(initialContext);
