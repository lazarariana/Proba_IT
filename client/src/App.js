import "./App.css";
import Navbar from './components/Navbar';
import { useState, useEffect } from "react";
import axios from "axios";
import React from 'react';
import Footer from './components/Footer';
import Body from './components/Body';
import UserContext from './components/UserContext';
import './components/App.css';

import bcrypt from 'bcryptjs';

import 'jquery';
import 'popper.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
  const [userEmail, setUserEmail] = useState(null); 
  return (
    <>
   // <UserContext.Provider value={{ userEmail, setUserEmail }}>
      <Navbar />
    </UserContext.Provider>
    <Body />
      <Footer/>
    </>
  );
};

export default App;