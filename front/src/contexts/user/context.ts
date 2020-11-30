import { createContext } from 'react';
import { UserContextInterface } from './interface';

const initialContext: UserContextInterface = {
  state: { channel: '', username: '', socket: null },
  dispatch: () => {
    return;
  }
};

export const UserContext = createContext(initialContext);
