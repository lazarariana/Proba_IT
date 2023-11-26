import React, { useState } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import logo from './logo.png';
import axios from "axios";
import bcrypt from 'bcryptjs';
import Cookies from 'js-cookie';
import './Navbar.css';

const MyNavbar = ({ isLoggedIn }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showCreatePoll, setShowCreatePoll] = useState(false);
  const [title, setTitle] = useState('');
  const [votingType, setVotingType] = useState('singleChoice');
  const [option1, setOption1] = useState('');
  const [option2, setOption2] = useState('');
  const [option3, setOption3] = useState('');

  const handleCloseCreatePoll = () => setShowCreatePoll(false);
  const handleShowCreatePoll = () => setShowCreatePoll(true);

  const createPoll = async (form) => {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    const sessionId = localStorage.getItem('sessionId'); // Get sessionId from localStorage
  
    console.log(sessionId);
    const response = await fetch('http://localhost:3001/createPoll', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-ID': sessionId,
      },
      body: JSON.stringify(data),
    });
  
    if (response.ok) {
      return true;
    } else {
      console.error('Failed to create poll');
      console.error(response);
      return false;
    }
  };

  const handleSubmitPoll = async (event) => {
    event.preventDefault();
    const success = await createPoll(event.target);
    if (success) {
      const formData = {
        title: title,
        votingType: votingType,
        options: [option1, option2, option3],
      };
    
      console.log(formData);
      handleCloseCreatePoll();
    }
  };


  const handleShowLogin = () => setShowLogin(true);

  const handleCloseLogin = () => {
    setShowLogin(false);
    setEmail('');
    setPassword('');
  };

  const handleCloseRegister = () => {
    setShowRegister(false);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleShowRegister = () => setShowRegister(true);

  const createUser = async () => {
    if (!email.includes('@gmail.com')) {
      setEmailError('Email must include "@gamil.com"');
      return;
    }

    // Check if an account with the provided email already exists
    try {
      const response = await axios.get('http://localhost:3001/getUsers', { params: { email } });

      if (response.data.length > 0) {
        setEmailError('That email is already in use!');
        handleCloseRegister();
        return;
      }
    } catch (error) {
      console.error('Error checking if email is in use:', error);
      return;
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    axios.post('http://localhost:3001/createUser', {
      email: email,
      password: hashedPassword,
    }).then((response) => {
      if (response.data.error) {
        setEmailError(response.data.error);
      } else {
        setEmailError('');
        setPasswordError('');
      }
    });

    handleCloseRegister();
    return (
      <div>{emailError && <p className="error">{emailError}</p>}</div>
    );
  };

  const validateForm = () => {
    let isValid = true;

    if (password.length < 8 || password.length > 32) {
      setPasswordError('Password must be between 8 and 32 characters');
      isValid = false;
    }

    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (validateForm()) {
      createUser();
    }
  };

  const loginUser = async () => {
    try {
      console.log(`Sending login request for email: ${email} with password: ${password}`);
      const response = await axios.post('http://localhost:3001/login', {
        email: email,
        password: password,
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.data.error) {
        setLoginError(response.data.error);
      } else {
        setLoginError('');
        setLoggedIn(true);
        handleCloseLogin();
        Cookies.set('token', response.data.token);
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const logoutUser = () => {
    setLoggedIn(false);
    Cookies.remove('token');
  };

  return (
    <Navbar fixed="top" expand="sm" bg="white" variant="light" style={{ paddingTop: "1.5%" }}>
      <Navbar.Brand href="/">
        <img src={logo} style={{ width: "80%" }} />
      </Navbar.Brand>
      <Navbar.Collapse className="justify-content-end">
        <Nav>
          {!loggedIn && (
            <>
              <Nav.Item>
                <Button variant="link" id="custom-btn" onClick={handleShowLogin}>Logare</Button>
              </Nav.Item>
              <Nav.Item>
                <Button variant="link" id="custom-btn" onClick={handleShowRegister}>Creare cont</Button>
              </Nav.Item>
            </>
          )}
        </Nav>
      </Navbar.Collapse>

      <Navbar.Collapse className="justify-content-end">
        <Nav>
          {loggedIn && (
            <>
              <Nav.Item>
                <Button variant="link" onClick={logoutUser} style={{ color: "#06114F" }}>Logout</Button>
              </Nav.Item>
              <Nav.Item>
                <Button variant="outline-success" className="mr-sm-2" onClick={handleShowCreatePoll}>Create poll</Button>
              </Nav.Item>
            </>
          )}
        </Nav>
      </Navbar.Collapse>


      {/* Login Modal */}
      <Modal show={showLogin} onHide={handleCloseLogin}>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseLogin}>
            Close
          </Button>
          <Button variant="primary" onClick={loginUser}>
            Login
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Register Modal */}
      <Modal show={showRegister} onHide={handleCloseRegister}>
        <Modal.Header closeButton>
          <Modal.Title>Welcome</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              {emailError && <p>{emailError}</p>}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Parola</Form.Label>
              <Form.Control type="password" placeholder="parola" value={password} onChange={(e) => setPassword(e.target.value)} />
              {passwordError && <p>{passwordError}</p>}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirm Parola</Form.Label>
              <Form.Control type="password" placeholder="confirm parola" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </Form.Group>

            <Button variant="primary" type="button" className="mt-3" onClick={createUser}>Creare cont</Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showCreatePoll} onHide={handleCloseCreatePoll}>
        <Modal.Header closeButton>
          <Modal.Title>Create Poll</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitPoll}>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" placeholder="Enter title" value={title} onChange={e => setTitle(e.target.value)} />
            </Form.Group>
            <Form.Label>Voting Type</Form.Label>
            <Form.Check type="radio" label="Single Choice" name="votingType" id="singleChoice" checked={votingType === 'singleChoice'} onChange={() => setVotingType('singleChoice')} />
            <Form.Check type="radio" label="Multiple Choice" name="votingType" id="multipleChoice" checked={votingType === 'multipleChoice'} onChange={() => setVotingType('multipleChoice')} />
            <Form.Label>Answer Options</Form.Label>
            <Form.Control type="text" placeholder="Option 1" value={option1} onChange={e => setOption1(e.target.value)} />
            <Form.Control type="text" placeholder="Option 2" value={option2} onChange={e => setOption2(e.target.value)} />
            <Form.Control type="text" placeholder="Option 3" value={option3} onChange={e => setOption3(e.target.value)} />
            <Button variant="primary" type="submit">Submit</Button>
          </Form>
        </Modal.Body>
      </Modal>

    </Navbar>
  );
};

export default MyNavbar;