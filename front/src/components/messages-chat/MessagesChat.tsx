import React, { useState, useEffect, useContext, useRef } from 'react';

import Messages from '../messages/Messages';
import Input from '../input-chat/Input';

import './MessagesChat.css';
import { MessagesContext } from '../../contexts/messages';
import { UserContext } from '../../contexts/user';
import {
  sendMessage as sendMessageAction,
  receiveMessage
} from '../../reducers/messages';
import { signOut } from '../../reducers/user';

function MessagesChat(): JSX.Element {
  const [message, setMessage] = useState('');
  const {
    state: { username, socket },
    dispatch: userDispatcher
  } = useContext(UserContext);
  const { state: messages, dispatch } = useContext(MessagesContext);
  const timeRef = useRef<number>();
  const counterRef = useRef<number>();
  const [messageSent, setMessageSent] = useState(false);

  const counter = (time: number) => {
    if (typeof timeRef.current !== 'number' || messageSent) {
      timeRef.current = time;
      setMessageSent(false);
    }
    const delta = time - timeRef.current;
    if (delta > parseInt(`${process.env.REACT_APP_ACCESS_EXP}`) * 1000) {
      if (!socket) return (window.location.href = '/');
      signOut(userDispatcher)({ socket });
    } else {
      counterRef.current = requestAnimationFrame(counter);
    }
  };

  useEffect(() => {
    counterRef.current = requestAnimationFrame(counter);
    return () => {
      if (counterRef.current === undefined) return;
      cancelAnimationFrame(counterRef.current);
    };
  }, []);

  useEffect(() => {
    if (!socket) {
      window.location.href = '/';
      return () => {
        return;
      };
    }
    window.onunload = () => signOut(userDispatcher)({ socket });
    socket.onmessage = receiveMessage(dispatch);
    return () => {
      return;
    };
  }, [socket]);

  const sendMessage = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (!socket) return;

    sendMessageAction(dispatch)({
      message: { username, text: message },
      socket
    });
    setMessageSent(true);
  };

  return (
    <div className="outerContainer">
      <div className="container">
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
