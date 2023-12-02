import React, { useEffect, useState, useContext } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import logo from './logo.png';
import axios from "axios";
import Cookies from 'js-cookie';
import './Navbar.css';
import PollContext from '../pollContext.js';
import DeletedPollContext from '../DeletedPollContext.js';
import UserContext from '../UserContext';
import LogContext from '../LogContext';


const MyNavbar = ({ isLoggedIn }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  //const [loggedIn, setLoggedIn] = useState(false);
  const { loggedIn, setLoggedIn } = useContext(LogContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { userId, setUserId } = useContext(UserContext);
  const { pollId, setPollId } = useContext(DeletedPollContext);

  const { pollCreated, setPollCreated } = useContext(PollContext);
  const { deleteButton, setDeleteButton } = useContext(LogContext);

  const [confirmPassword, setConfirmPassword] = useState('');
  const [loginError, setLoginError] = useState('');
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

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('User is not logged in');
        return;
      }

      axios.defaults.withCredentials = true;
      const createResponse = await axios.post('http://localhost:3001/createPoll', {
        userId: userId,
        title: title,
        votingType: votingType,
        options: [{ text: option1 }, { text: option2 }, { text: option3 }],
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (createResponse.data.message) {
        console.error(createResponse.data.message);
      } else {
        setPollCreated(true);
        console.log('Poll created successfully');
        setPollId(createResponse.data._id);
        handleCloseCreatePoll();
      }
    } catch (error) {
      console.error('Error checking if user exists:', error);
      return;
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

  const logoutUser = () => {
    setLoggedIn(false);
    Cookies.remove('token');
  };

  const createUser = async () => {
    if (!validateForm()) {
      return;
    }


    if (!email.includes('@gmail.com')) {
      setEmailError('Email must include "@gmail.com"');
      return;
    }

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

    try {
      const response = await axios.post('http://localhost:3001/createUser', {
        email: email,
        password: password,
      });

      if (response.data.error) {
        setEmailError(response.data.error);
      } else {
        setEmailError('');
        setPasswordError('');
        handleCloseRegister();
        Cookies.set('token', response.data.user.token);
        setUserId(response.data._id);
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }

    return (
      <div>{emailError && <p className="error">{emailError}</p>}</div>
    );
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

      if (response.data.message) {
        setLoginError(response.data.message);
      } else {
        setLoginError('');
        setLoggedIn(true);
        setEmail(email);
        setUserId(response.data.user._id);
        console.log(`User logged in with ID: ${response.data.user._id}`);
        localStorage.setItem('token', response.data.token);
        handleCloseLogin();
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <Navbar expand="sm" bg="white" variant="light" className='navbar container-fluid'>
      <Navbar.Brand href="/">
        <img src={logo} style={{ width: "93.54px", height: "42.07px", position: "relative", left: "15px" }} />
      </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" className="mr-2" />
        <Navbar.Collapse id="responsive-navbar-nav" className="d-flex justify-content-end">
          <Nav className="ml-auto">
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
        </Navbar.Collapse>

      {/* Login Modal */}
      <Modal show={showLogin} onHide={handleCloseLogin}  className="my-modal modal-dialog">
        <Modal.Header closeButton style={{ backgroundColor: '#04395E', color: 'white', border: 'none' }}>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#04395E', color: 'white' }}>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
                onFocus={(e) => e.target.style.backgroundColor = "#f0f0f0"} />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
                onFocus={(e) => e.target.style.backgroundColor = "#f0f0f0"} />
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
              <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              {passwordError && <p>{passwordError}</p>}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control type="password" placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                onFocus={(e) => e.target.style.backgroundColor = "#f0f0f0"} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: '#04395E', color: 'white' }} onFocus={(e) => e.target.style.backgroundColor = "#f0f0f0"} className="d-flex justify-content-center">
          <Button variant="primary" type="button" className="mt-3" onClick={createUser} style={{ backgroundColor: 'white', color: '#04395E' }}>
            Create account
          </Button>
        </Modal.Footer>

      </Modal>

      {/* Create Poll Modal */}
      <Modal show={showCreatePoll} onHide={handleCloseCreatePoll} centered>
        <Modal.Header closeButton style={{ backgroundColor: '#04395E', border: 'none', color: 'white' }}>
          <Modal.Title>Create a poll</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#04395E', color: 'white' }}>
          <Form onSubmit={handleSubmitPoll}>
            <Form.Group controlId="title" style={{ marginBottom: '10px' }}>
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" placeholder="Enter title" value={title} onChange={e => setTitle(e.target.value)} onFocus={(e) => e.target.style.backgroundColor = "#f0f0f0"} style={{ backgroundColor: 'rgba(217, 217, 217, 0.72)', borderTop: '3px solid #FF1F66', borderLeft: 'none', borderRight: 'none', borderBottom: 'none', fontSize: '18px' }} />
            </Form.Group>
            <Form.Label style={{ marginBottom: '10px', fontSize: '18px' }}>Voting Type</Form.Label>
            <Form.Check type="radio" label="Single Choice" name="votingType" id="singleChoice" checked={votingType === 'singleChoice'} onChange={() => setVotingType('singleChoice')} style={{ marginBottom: '10px', fontSize: '18px' }} />
            <Form.Check type="radio" label="Multiple Choice" name="votingType" id="multipleChoice" checked={votingType === 'multipleChoice'} onChange={() => setVotingType('multipleChoice')} style={{ marginBottom: '10px', fontSize: '18px' }} />
            <Form.Label style={{ marginBottom: '10px', fontSize: '18px' }}>Answer Options</Form.Label>
            <Form.Control type="text" placeholder="Option 1" value={option1} onChange={e => setOption1(e.target.value)} onFocus={(e) => e.target.style.backgroundColor = "#f0f0f0"} style={{ backgroundColor: 'rgba(217, 217, 217, 0.72)', borderTop: '3px solid #FF1F66', borderLeft: 'none', borderRight: 'none', borderBottom: 'none', marginBottom: '10px', fontSize: '18px' }} />
            <Form.Control type="text" placeholder="Option 2" value={option2} onChange={e => setOption2(e.target.value)} onFocus={(e) => e.target.style.backgroundColor = "#f0f0f0"} style={{ backgroundColor: 'rgba(217, 217, 217, 0.72)', borderTop: '3px solid #FF1F66', borderLeft: 'none', borderRight: 'none', borderBottom: 'none', marginBottom: '10px', fontSize: '18px' }} />
            <Form.Control type="text" placeholder="Option 3" value={option3} onChange={e => setOption3(e.target.value)} onFocus={(e) => e.target.style.backgroundColor = "#f0f0f0"} style={{ backgroundColor: 'rgba(217, 217, 217, 0.72)', borderTop: '3px solid #FF1F66', borderLeft: 'none', borderRight: 'none', borderBottom: 'none', marginBottom: '10px', fontSize: '18px' }} />
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