import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import './App.css';
import Sign from './components/sign/Sign';
import MessagesChat from './components/messages-chat/MessagesChat';
import { UserProvider } from './contexts/user';
import { MessagesProvider } from './contexts/messages';

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Route path="/" exact component={Sign} />
        <MessagesProvider>
          <Route path="/chat" component={MessagesChat} />
        </MessagesProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
