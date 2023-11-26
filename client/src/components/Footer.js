import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import instagramIcon from './mdi_instagram.png';
import twitchIcon from './mdi_twitch.png';
import facebookIcon from './uil_facebook.png';

const Footer = () => (
    <footer className="p-3 bg-danger text-white text-center position-fixed w-100" style={{ bottom: 0 }}>
    <Container>
      <Row>
        <Col>
          <a target="blank" href="https://www.instagram.com/lsacbucuresti/">
            <img src={instagramIcon} style={{ paddingRight: '20px',width: '50px', height: '50px' }} alt="" />
          </a>
          <a target="blank" href="https://www.facebook.com/LsacBucuresti/">
            <img src={facebookIcon} style={{ paddingRight: '20px',width: '50px', height: '50px' }} alt="" />
          </a>
          <a target="blank" href="https://www.twitch.tv/lsac_bucuresti">
            <img src={twitchIcon} style={{ paddingRight: '20px',width: '60px', height: '50px' }} alt="" />
          </a>
        </Col>
      </Row>
    </Container>
  </footer>
);

export default Footer;