import React, { useEffect, useState, useContext } from 'react';
import { Form, Row, Col, Modal } from 'react-bootstrap';
import tortoise from './testoasa.png';
import backgroundImage from './bg.png';
import PollContext from '../pollContext.js';
import DeletedPollContext from '../DeletedPollContext.js';
import axios from "axios";
import UserContext from '../UserContext';

const Body = () => {
  const [polls, setPolls] = useState([]);
  const { userId, setUserId } = useContext(UserContext);

  // Apply the background image to the body of the document
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

  // Fetch the polls when the component mounts
  useEffect(() => {
    fetch('http://localhost:3001/getPolls')
      .then(response => response.json())
      .then(data => setPolls(data))
      .catch(error => console.error('Error:', error));
  }, []);

  // Fetch the polls again whenever a new poll is created
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
        fetch('http://localhost:3001/getPolls')
        .then(response => response.json())
        .then(data => {
          setPolls(data);
          setPollCreated(false);
        })
        .catch(error => console.error('Error:', error));
        // Fetch the polls again or update your state here
      }
    } catch (error) {
      console.error('Error deleting poll:', error);
      return;
    }
  };

  return (

    <div style={{
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      height: '100%',
      width: '100%',
      position: 'relative'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '50px',
      }}>
        <div style={{
          width: "592px",
          height: "282px",
          marginLeft: '250px',
        }}>
          <p style={{
            color: 'white',
            fontFamily: "Inter",
            fontSize: "36px",
            fontWeight: "600",
            lineHeight: "47px",
            letterSpacing: "-0.005em",
            textAlign: "left",
          }}>
            Opiniile sunt mai importante ca niciodată.
            Platformele de sondaje permit organizatorilor să culeagă feedback
            direct de la audiența lor și să înțeleagă mai bine nevoile și dorințele acesteia.
          </p>
        </div>
        <img src={tortoise} alt="description" style={{
          width: "785px",
          height: "483px",
        }} />
      </div>

      <div style={{
        position: 'relative',
      }}>
        {polls.map((poll, index) => {
          const row = Math.floor(index / 2);
          const col = index % 2;
          const top = 100 + row * 610;
          const left = col === 0 ? 103 : 767;
          return (
            <div key={poll._id} style={{
              position: 'absolute',
              top: `${top}px`,
              left: `${left}px`,
              width: "571px",
              height: "592px",
              borderRadius: "26px",
            }}>

              <Modal.Dialog style={{
                backgroundColor: 'white',
                borderRadius: '10px',
                width: '100%',
                height: '100%'
              }}>
                <Modal.Header>
                  <Modal.Title style={{
                    color: 'black',
                    fontFamily: 'Inter',
                    fontSize: '26px',
                    fontWeight: '500',
                    lineHeight: '31px',
                    letterSpacing: '0em',
                    textAlign: 'left',
                    width: '539px',
                    height: '62px',
                    marginTop: '20px',
                    marginLeft: '20px'
                  }}>
                    {poll.title}
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <p style={{
                    color: 'black',
                    fontFamily: 'Inter',
                    fontSize: '18px',
                    fontWeight: '300',
                    lineHeight: '22px',
                    letterSpacing: '0em',
                    textAlign: 'left',
                    width: '158px',
                    height: '26px',
                    marginLeft: '20px'
                  }}>
                    Make a choice:
                  </p>
                  <p style={{
                    color: 'light grey',
                    fontFamily: 'Inter',
                    fontSize: '26px',
                    fontWeight: '300',
                    lineHeight: '22px',
                    letterSpacing: '0em',
                    textAlign: 'left',
                    width: '158px',
                    height: '26px',
                    position: 'absolute',
                    top: '724px',
                    left: '799px',
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
                        fontSize: '28px',
                        fontWeight: '400',
                        lineHeight: '33px',
                        letterSpacing: '0em',
                        textAlign: 'left',
                        width: '117px',
                        height: '29px',
                        marginLeft: '20px'
                      }}
                    />
                  ))}
                </Modal.Body>
              </Modal.Dialog>
              <button style={{
                position: 'absolute', bottom: '10px', left: '10px',
                backgroundColor: '#04395E', color: 'white',
              }}
                onClick={() => deletePoll(poll._id)}>Delete
              </button>
            </div>
          );
        })}
      </div >
    </div >
  );
};

export default Body;