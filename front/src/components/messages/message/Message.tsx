import React from 'react';
import './Message.css';
import { emojify } from 'react-emoji';

const Message = ({
  message: { text, username },
  senderName
}: {
  message: { text: string; username: string };
  senderName: string;
}): JSX.Element => {
  let isSentByCurrentUser = false;

  const trimmedName = senderName.trim();

  if (username === trimmedName) {
    isSentByCurrentUser = true;
  }

  return isSentByCurrentUser ? (
    <div className="messageContainer justifyEnd">
      <p className="sentText pr-10">{trimmedName}</p>
      <div className="messageBox backgroundBlue">
        <p className="messageText colorWhite">{emojify(text)}</p>
      </div>
    </div>
  ) : (
    <div className="messageContainer justifyStart">
      <div className="messageBox backgroundLight">
        <p className="messageText colorDark">{emojify(text)}</p>
      </div>
      <p className="sentText pl-10 ">{username}</p>
    </div>
  );
};

export default Message;
