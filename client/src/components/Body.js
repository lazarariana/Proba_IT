import React, { useEffect, useState, useContext } from 'react';
import { Form, Row, Col, Modal, Container } from 'react-bootstrap';
import tortoise from './testoasa.png';
import backgroundImage from './bg.png';
import PollContext from '../pollContext.js';
import DeletedPollContext from '../DeletedPollContext.js';
import axios from "axios";
import UserContext from '../UserContext';
import LogContext from '../LogContext';
import './Body.css';

const Body = () => {
  const [polls, setPolls] = useState([]);
  const { userId, setUserId } = useContext(UserContext);


  useEffect(() => {
    document.body.style.backgroundImage = `url(${backgroundImage})`;
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundSize = 'cover';
    document.body.style.height = '100vh';
    document.body.style.width = '100vw';
    document.body.style.margin = 0;
    document.body.style.padding = 0;
  }, []);

  const { pollCreated, setPollCreated } = useContext(PollContext);
  const { pollId, setPollId } = useContext(DeletedPollContext);
  const { loggedIn, setLoggedIn } = useContext(LogContext);

  useEffect(() => {
    fetch('http://localhost:3001/getPolls')
      .then(response => response.json())
      .then(data => setPolls(data))
      .catch(error => console.error('Error:', error));
  }, []);

  useEffect(() => {
    if (pollCreated) {
      fetch('http://localhost:3001/getPolls')
        .then(response => response.json())
        .then(data => {
          setPolls(data);
          setPollCreated(false);
        })
        .catch(error => console.error('Error:', error));
    }
  }, [pollCreated]);


  const deletePoll = async (pollId) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('User is not logged in');
        return;
      }

      axios.defaults.withCredentials = true;
      const deleteResponse = await axios.delete('http://localhost:3001/deletePoll', {
        data: { pollId, userId },
        headers: { Authorization: `Bearer ${token}` }
      });

      if (deleteResponse.data.message) {
        console.error(deleteResponse.data.message);
      } else {
        console.log('Poll deleted successfully');
        setPolls((prevPolls) => prevPolls.filter((poll) => poll._id !== pollId));

        const response = await fetch('http://localhost:3001/getPolls');
        const data = await response.json();
        setPolls(data);
      }
    } catch (error) {
      console.error('Error deleting poll:', error);
      return;
    }
  };

  useEffect(() => {
    fetch('http://localhost:3001/getPolls')
      .then(response => response.json())
      .then(data => {
        setPolls(data);
        setPollCreated(false);
      })
      .catch(error => console.error('Error:', error));
  }, [polls]);

  return (
    <>
      <Container fluid className="d-flex flex-column flex-md-row overflow-auto bg-cover bg-no-repeat bg-fixed container-padding" style={{ backgroundImage: `url(${backgroundImage})`, marginBottom: '30px' }}>
        <Col xs={12} md={6} className="align-items-center mt-5">
          <p className="text-white ml-md-5 w-75" style={{
            fontFamily: "Inter",
            fontSize: "2vw",
            fontWeight: "600",
            lineHeight: "40px",
            letterSpacing: "-0.005em",
            marginLeft: '2vw',
            marginTop: '90px',
          }}>
            Opiniile sunt mai importante ca niciodată.
            Platformele de sondaje permit organizatorilor să culeagă feedback
            direct de la audiența lor și să înțeleagă mai bine nevoile și dorințele acesteia.
          </p>
        </Col>
        <Col xs={12} md={6} className="justify-content-center mt-4">
          <img src={tortoise} alt="description" style={{
            width: '50vw',
            height: '40vw',
            display: 'block',
            marginLeft: '0',
            marginRight: '0',
          }} />
        </Col>
      </Container>


      <div className="polls-container" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(40%, 1fr))',
        gap: '5px', // Add space between rows
        justifyContent: 'center',
        padding: '0 10px',
      }}>
        {polls.map((poll, index) => {
          const isEvenIndex = index % 2 === 0;
          const leftButton = isEvenIndex ? '50px' : '60px';
          return (
            <div key={poll._id} className='poll'>


              <Modal.Dialog key={poll.id || index} style={{
                backgroundColor: 'white',
                borderRadius: '10px',
                width: '100%',
                height: '100%'
              }}>
                <Modal.Header>
                  <Modal.Title style={{
                    color: 'black',
                    fontFamily: 'Inter',
                    fontSize: '2vw',
                    fontWeight: '500',
                    lineHeight: '31px',
                    letterSpacing: '0em',
                    textAlign: 'left',
                    width: 'auto',
                    height: 'auto',
                    marginTop: '20px',
                    marginLeft: '20px',
                    marginBottom: '2vw'
                  }}>
                    {poll.title}
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <p style={{
                    color: 'black',
                    fontFamily: 'Inter',
                    fontSize: '2vw',
                    fontWeight: '300',
                    lineHeight: '22px',
                    letterSpacing: '0em',
                    textAlign: 'left',
                    width: '300px',
                    height: '26px',
                    marginLeft: '20px',
                    marginBottom: '2vw'
                  }}>
                    Make a choice:
                  </p>
                  <p style={{
                    color: 'light grey',
                    fontFamily: 'Inter',
                    fontSize: '2vw',
                    fontWeight: '300',
                    lineHeight: '22px',
                    letterSpacing: '0em',
                    textAlign: 'left',
                    width: '158px',
                    height: '26px',
                    position: 'absolute',
                    top: '724px',
                    left: '799px',
                    marginLeft: '20px',
                  }}>
                  </p>
                  {poll.options.map((option, index) => (

                    <Form.Check
                      type="radio"
                      id={`option-${index}`}
                      label={option}
                      name="options"
                      style={{
                        color: 'black',
                        fontFamily: 'Inter',
                        fontSize: '2vw',
                        fontWeight: '400',
                        lineHeight: '3vw',
                        letterSpacing: '0em',
                        textAlign: 'left',
                        width: '20vw',
                        height: '20px',
                        marginLeft: '20px',
                        marginBottom: '20px'
                      }}
                    />
                  ))}
                </Modal.Body>

                {loggedIn && (
                  <button className="delete-button" onClick={() => deletePoll(poll._id)}>Delete</button>
                )}
              </Modal.Dialog>
            </div>
          );
        })}
      </div>

    </>
  );
};

export default Body;