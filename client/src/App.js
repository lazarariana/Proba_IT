import "./App.css";
import Navbar from './components/Navbar';
import React, { useEffect, useState, useContext } from 'react';
import Footer from './components/Footer';
import Body from './components/Body';
import './components/App.css';
import PollContext from './pollContext.js';
import DeletedPollContext from './DeletedPollContext.js';
import UserContext from './UserContext';
import LogContext from './LogContext';
import 'jquery';
import 'popper.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
  const [userEmail, setUserEmail] = useState(null);
  const [pollCreated, setPollCreated] = useState(false);
  const [pollId, setPollId] = useState('');
  const [loginError, setLoginError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <>
      <UserContext.Provider value={{ userId, setUserId }}>
        <LogContext.Provider value={{ loggedIn, setLoggedIn }}>
          <PollContext.Provider value={{ pollCreated, setPollCreated }}>
            <DeletedPollContext.Provider value={{ pollId, setPollId }}>
              <Navbar />
              <div style={{ flex: 1, paddingBottom: '70px' }}>
                <Body />
              </div>
              <Footer />
            </DeletedPollContext.Provider>
          </PollContext.Provider>
        </LogContext.Provider>
      </UserContext.Provider >
    </>
  );
};

export default App;