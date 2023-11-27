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
import { useContext } from 'react';
import UserContext from './UserContext';


const MyNavbar = ({ isLoggedIn }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sessionId, setSessionId] = useState('');


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

  const handleSubmitPoll = async (event) => {

    event.preventDefault();

    // asociez poll-ul cu user-ul care l-a creat
    try {
      const response = await axios.get('http://localhost:3001/getUsers', { params: { email } });

      if (response.data.length > 0) {
        console.log(email);

        // Create poll directly here
        axios.defaults.withCredentials = true;
        const token = localStorage.getItem('token');
        const createResponse = await axios.post('http://localhost:3001/createPoll', {
          title: title,
          votingType: votingType,
          options: [option1, option2, option3],
          email: email,
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (createResponse.data.error) {
          console.error(createResponse.data.error);
        } else {
          console.log('Poll created successfully');
          handleCloseCreatePoll();
        }
      }

    } catch (error) {
      console.error('Error checking if email is in use:', error);
      return;
    }
  };

  const handleShowLogin = () => setShowLogin(true);

  const handleCloseLogin = () => {
    setShowLogin(false);
    //setEmail('');
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

    try {
      const response = await axios.post('http://localhost:3001/createUser', {
        email: email,
        password: hashedPassword,
      });

      if (response.data.error) {
        setEmailError(response.data.error);
      } else {
        setEmailError('');
        setPasswordError('');

        handleCloseRegister();
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }

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
          'Content-Type': 'application/json',
        }
      });
      if (response.data.error) {
        setLoginError(response.data.error);
      } else {
        setLoginError('');
        setLoggedIn(true);
        setEmail(email);
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
        <Navbar.Brand href="/">
          <img src={logo} style={{ width: "93.54px", height: "42.07px", position: "relative", left: "25px", }} />
        </Navbar.Brand>
      </Navbar.Brand>
      <Navbar.Collapse className="justify-content-end">
        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
          <Nav>
            {!loggedIn && (
              <>
                <Nav.Item>
                  <Button variant="link" id="custom-btn" onClick={handleShowLogin}
                    style={{
                      color: "#04395E", fontFamily: "Inter", fontSize: "22px",
                      fontWeight: "500", lineHeight: "27px", letterSpacing: "0em",
                      textAlign: "left", textDecoration: "none"
                    }}>Login</Button>
                </Nav.Item>
                <Nav.Item>
                  <Button variant="link" id="custom-btn" onClick={handleShowRegister}
                    style={{
                      color: "#04395E", fontFamily: "Inter", fontSize: "22px", fontWeight: "500",
                      lineHeight: "27px", letterSpacing: "0em", textAlign: "left", textDecoration: "none"
                    }}>Register</Button>
                </Nav.Item>
              </>
            )}
            {loggedIn && (
              <>
                <Nav.Item>
                  <Button
                    variant="link"
                    onClick={logoutUser}
                    style={{
                      color: "#04395E", fontFamily: "Inter", fontSize: "22px",
                      fontWeight: "500", lineHeight: "27px", letterSpacing: "0em",
                      textAlign: "left", textDecoration: "none"
                    }}>Log out</Button>
                </Nav.Item>
                <Nav.Item>
                  <Button
                    variant="outline-success"
                    className="mr-sm-2 custom-button"
                    onClick={handleShowCreatePoll}
                    style={{
                      color: "#04395E", fontFamily: "Inter", fontSize: "22px", fontWeight: "500",
                      lineHeight: "27px", letterSpacing: "0em", textAlign: "left", textDecoration: "none",
                      border: "none"
                    }} >Create poll</Button>
                </Nav.Item>
              </>
            )}
          </Nav>
        </div>
      </Navbar.Collapse>

      {/* Login Modal */}
      <Modal show={showLogin} onHide={handleCloseLogin} centered>
        <Modal.Header closeButton style={{ backgroundColor: '#04395E', color: 'white', border: 'none' }}>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#04395E', color: 'white' }}>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: '#04395E', color: 'white' }} className="d-flex justify-content-center">
          <Button variant="primary" onClick={loginUser} style={{ backgroundColor: 'white', color: '#04395E' }} >
            Login
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Register Modal */}
      <Modal show={showRegister} onHide={handleCloseRegister} centered>
        <Modal.Header closeButton style={{ backgroundColor: '#04395E', color: 'white', border: 'none' }}>
          <Modal.Title>Register</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#04395E', color: 'white' }}>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              {emailError && <p>{emailError}</p>}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ color: 'white', '::placeholder': { color: 'white !important' } }} />
              {passwordError && <p>{passwordError}</p>}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control type="password" placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: '#04395E', color: 'white' }} className="d-flex justify-content-center">
          <Button variant="primary" type="button" className="mt-3" onClick={createUser} style={{ backgroundColor: 'white', color: '#04395E' }}>
            Create account
          </Button>
        </Modal.Footer>

      </Modal>

      {/* Create Poll Modal */}
      <Modal show={showCreatePoll} onHide={handleCloseCreatePoll} centered>
        <Modal.Header closeButton style={{ backgroundColor: '#04395E', color: 'white', border: 'none' }}>
          <Modal.Title>Create a poll</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#04395E', color: 'white' }}>
          <Form onSubmit={handleSubmitPoll}>
            <Form.Group controlId="title" style={{ marginBottom: '10px' }}>
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" placeholder="Enter title" value={title} onChange={e => setTitle(e.target.value)} style={{ backgroundColor: 'rgba(217, 217, 217, 0.72)', color: 'white', borderTop: '3px solid #FF1F66', borderLeft: 'none', borderRight: 'none', borderBottom: 'none', fontSize: '18px' }} />
            </Form.Group>
            <Form.Label style={{ marginBottom: '10px', fontSize: '18px' }}>Voting Type</Form.Label>
            <Form.Check type="radio" label="Single Choice" name="votingType" id="singleChoice" checked={votingType === 'singleChoice'} onChange={() => setVotingType('singleChoice')} style={{ marginBottom: '10px', fontSize: '18px' }} />
            <Form.Check type="radio" label="Multiple Choice" name="votingType" id="multipleChoice" checked={votingType === 'multipleChoice'} onChange={() => setVotingType('multipleChoice')} style={{ marginBottom: '10px', fontSize: '18px' }} />
            <Form.Label style={{ marginBottom: '10px', fontSize: '18px' }}>Answer Options</Form.Label>
            <Form.Control type="text" placeholder="Option 1" value={option1} onChange={e => setOption1(e.target.value)} style={{ backgroundColor: 'rgba(217, 217, 217, 0.72)', color: 'white', borderTop: '3px solid #FF1F66', borderLeft: 'none', borderRight: 'none', borderBottom: 'none', marginBottom: '10px', fontSize: '18px' }} />
            <Form.Control type="text" placeholder="Option 2" value={option2} onChange={e => setOption2(e.target.value)} style={{ backgroundColor: 'rgba(217, 217, 217, 0.72)', color: 'white', borderTop: '3px solid #FF1F66', borderLeft: 'none', borderRight: 'none', borderBottom: 'none', marginBottom: '10px', fontSize: '18px' }} />
            <Form.Control type="text" placeholder="Option 3" value={option3} onChange={e => setOption3(e.target.value)} style={{ backgroundColor: 'rgba(217, 217, 217, 0.72)', color: 'white', borderTop: '3px solid #FF1F66', borderLeft: 'none', borderRight: 'none', borderBottom: 'none', marginBottom: '10px', fontSize: '18px' }} />
            <div className="d-flex justify-content-center mt-3">
              <Button variant="primary" type="submit" style={{ backgroundColor: 'white', color: '#04395E' }}>Create Poll</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

    </Navbar >
  );
};

export default MyNavbar;