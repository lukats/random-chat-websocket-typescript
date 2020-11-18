import React from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import Message from './message/Message';
import './Messages.css';

const Messages = ({
  messages,
  name
}: {
  messages: { text: string; user: string }[];
  name: string;
}): JSX.Element => (
  <ScrollToBottom className="messages">
    {messages.map((message, i) => (
      <div key={i}>
        <Message message={message} name={name} />
      </div>
    ))}
  </ScrollToBottom>
);

export default Messages;
