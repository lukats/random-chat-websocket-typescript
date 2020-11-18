import React, { useState, useEffect, useContext } from 'react';

import Messages from '../messages/Messages';
import Input from '../input-chat/Input';

import './MessagesChat.css';
import { MessagesContext } from '../../contexts/messages';
import { UserContext } from '../../contexts/user';

function MessagesChat(): JSX.Element {
  const [message, setMessage] = useState('');
  const {
    state: { username }
  } = useContext(UserContext);
  const { state: messages } = useContext(MessagesContext);

  useEffect(() => {
    // TODO: socket listener
  }, []);

  const sendMessage = (event: { preventDefault: () => void }) => {
    event.preventDefault();
  };

  return (
    <div className="outerContainer">
      <div className="container">
        <Messages messages={messages} name={username} />
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
