import { MessageInterface } from '../../../contexts/messages/interface';
import { MessagesState } from '../interface';

export function addMessage(
  state: MessagesState,
  payload: MessageInterface
): MessagesState {
  return [...state, payload];
}
