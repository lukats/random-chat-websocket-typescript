import React from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import Message from './message/Message';
import './Messages.css';

const Messages = ({
  messages,
  senderName
}: {
  messages: { text: string; username: string }[];
  senderName: string;
}): JSX.Element => (
  <ScrollToBottom className="messages">
    {messages.map((message, i) => (
      <div key={i}>
        <Message message={message} senderName={senderName} />
      </div>
    ))}
  </ScrollToBottom>
);

export default Messages;
