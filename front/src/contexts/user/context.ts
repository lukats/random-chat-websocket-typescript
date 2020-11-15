import { createContext } from 'react';
import { UserContextInterface } from './interface';

const initialContext: UserContextInterface = {
  state: { token: '', username: '', socket: {} },
  reducer: () => {},
};

export const UserContext = createContext(initialContext);
