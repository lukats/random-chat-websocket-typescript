import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback
} from 'react';

import Messages from '../messages/Messages';
import Input from '../input-chat/Input';

import './MessagesChat.css';
import { MessagesContext } from '../../contexts/messages';
import { UserContext } from '../../contexts/user';
import {
  sendMessage as sendMessageAction,
  receiveMessage,
  eraseMessages
} from '../../reducers/messages';
import { signOut } from '../../reducers/user';
import { useHistory } from 'react-router-dom';

function MessagesChat(): JSX.Element {
  const [message, setMessage] = useState('');
  const {
    state: { username, socket, channel },
    dispatch: userDispatcher
  } = useContext(UserContext);
  const { state: messages, dispatch } = useContext(MessagesContext);
  const timeRef = useRef<number>();
  const counterRef = useRef<number>();
  const [messageSent, setMessageSent] = useState(false);
  const history = useHistory();

  const counter = useCallback(
    (time: number) => {
      if (typeof timeRef.current !== 'number' || messageSent) {
        timeRef.current = time;
        setMessageSent(false);
      }
      const delta = time - timeRef.current;
      if (delta > parseInt(`${process.env.REACT_APP_ACCESS_EXP}`) * 1000) {
        eraseMessages(dispatch)();
        signOut(userDispatcher)({ socket, replace: history.replace });
      } else {
        counterRef.current = requestAnimationFrame(counter);
      }
    },
    [dispatch, history.replace, messageSent, socket, userDispatcher]
  );

  useEffect(() => {
    counterRef.current = requestAnimationFrame(counter);
    return () => {
      if (counterRef.current === undefined) return;
      cancelAnimationFrame(counterRef.current);
    };
  }, [counter]);

  useEffect(() => {
    window.addEventListener('unload', async () => {
      eraseMessages(dispatch)();
      await signOut(userDispatcher)({ socket, replace: history.replace });
    });
    window.onbeforeunload = () => {
      window.setTimeout(() => {
        window.location.replace('/');
      }, 0);
      window.onbeforeunload = null;
    };
    if (!socket) {
      history.replace('/');
      return () => {
        return;
      };
    }
    socket.on(channel, receiveMessage(dispatch));
    return () => {
      return;
    };
  }, [channel, dispatch, history, socket, userDispatcher]);

  const sendMessage = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (!socket) return;

    sendMessageAction(dispatch)({
      message: { username, text: message },
      socket,
      channel,
      dispatch: userDispatcher
    });
    setMessage('');
    setMessageSent(true);
  };

  return (
    <div className="outerContainer">
      <div className="container">
        <div className="header-bar">
          <button
            style={{ zIndex: 1 }}
            className="button switch sign-out-button"
            onClick={async () => {
              eraseMessages(dispatch)();
              await signOut(userDispatcher)({
                socket,
                replace: history.replace
              });
            }}
          >
            Sign Out
          </button>
        </div>
        <Messages messages={messages} senderName={username} />
        <Input
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
    </div>
  );
}

export default MessagesChat;
