import React, { SetStateAction } from 'react';

import './Input.css';

const Input = ({
  setMessage,
  sendMessage,
  message
}: {
  setMessage: React.Dispatch<SetStateAction<string>>;
  sendMessage: (event: { preventDefault: () => void }) => void;
  message: string;
}): JSX.Element => (
  <div className="form">
    <input
      className="input"
      type="text"
      placeholder="Type a message..."
      value={message}
      onChange={({ target: { value } }) => setMessage(value)}
      onKeyPress={({ key, preventDefault }) =>
        key === 'Enter' ? sendMessage({ preventDefault }) : null
      }
    />
    <button
      className="sendButton"
      onClick={({ preventDefault }) => sendMessage({ preventDefault })}
    >
      Send
    </button>
  </div>
);

export default Input;
