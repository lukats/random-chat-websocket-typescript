import { MessageInterface } from '../../../contexts/messages/interface';
import { MessagesState } from '../interface';

export function addMessage(state: MessagesState, payload: MessageInterface) {
  return [...state, payload];
}
