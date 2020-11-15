import { RESET } from '../actionTypes';
import { ADD_MESSAGE } from './actionTypes';
import { addMessage } from './functions/addMessage';
import { MessagesState, ReducerAction } from './interface';

export default function reducer(
  state: MessagesState,
  action: ReducerAction
): MessagesState {
  switch (action.type) {
    case ADD_MESSAGE:
      return addMessage(state, action.payload);
    case RESET:
      return [];
    default:
      throw new Error();
  }
}
