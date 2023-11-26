import "./App.css";
import Navbar from './components/Navbar';
import { useState, useEffect } from "react";
import axios from "axios";
import React from 'react';
import Footer from './components/Footer';

import bcrypt from 'bcryptjs';

import 'jquery';
import 'popper.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
  return (
    <>
      <Navbar />
      <Footer/>
    </>
  );
};

export default App;