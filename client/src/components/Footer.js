import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import instagramIcon from './mdi_instagram.png';
import twitchIcon from './mdi_twitch.png';
import facebookIcon from './uil_facebook.png';
import './Footer.css';

const Footer = () => (
  <footer className="p-1 text-white text-center position-fixed" style={{ bottom: 0, backgroundColor: '#FF1F66', height: '50px', paddingBottom: '20px', width: '100%', maxWidth: '100vw' }}>
    <Container>
      <Row>
        <Col>
          <a target="blank" href="https://www.instagram.com/lsacbucuresti/">
            <img src={instagramIcon} style={{ paddingRight: '20px', width: '50px', height: '50px', padding: '7.75px 13.29px' }} alt="" />
          </a>
          <a target="blank" href="https://www.facebook.com/LsacBucuresti/">
            <img src={facebookIcon} style={{ paddingRight: '20px', width: '50px', height: '50px', padding: '7.75px 13.29px' }} alt="" />
          </a>
          <a target="blank" href="https://www.twitch.tv/lsac_bucuresti">
            <img src={twitchIcon} style={{ paddingRight: '20px', width: '50px', height: '50px', padding: '7.75px 13.29px' }} alt="" />
          </a>
        </Col>
      </Row>
    </Container>
  </footer>
);

export default Footer;