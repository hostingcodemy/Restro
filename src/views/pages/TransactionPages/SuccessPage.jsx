import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FaRegThumbsUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';
import ReactDOM from 'react-dom';
import './SuccessPage.css';

const ConfettiOverlay = ({ active, numberOfPieces = 500 }) => {
  const [width, height] = useWindowSize();

  if (!active) return null;

  return ReactDOM.createPortal(
    <Confetti
      width={width}
      height={height}
      numberOfPieces={numberOfPieces}
      recycle={false}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    />,
    document.body
  );
};

const SuccessPage = () => {
  const [seconds, setSeconds] = useState(5);
  const [showConfetti, setShowConfetti] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const delayConfetti = setTimeout(() => setShowConfetti(true), 100);
    const countdown = setInterval(() => setSeconds((s) => s - 1), 1000);
    // const redirect = setTimeout(() => navigate('/login'), 5000);
    const stopConfetti = setTimeout(() => setShowConfetti(false), 5000);

    return () => {
      clearTimeout(delayConfetti);
      clearInterval(countdown);
      // clearTimeout(redirect);
      clearTimeout(stopConfetti);
    };
  }, [navigate]);

  return (
    <Container style={{background: "#F0F0F0"}} fluid className="thankyou-bg d-flex align-items-center justify-content-center">
      <ConfettiOverlay active={showConfetti} />

      <Row className="w-100 justify-content-center">
        <Col xs={11} sm={10} md={8} lg={6} xl={5}>
          <div className="thankyou-card text-center p-4 shadow-sm rounded-4">
            <div className="icon-wrapper mb-3">
              <FaRegThumbsUp className="thankyou-icon text-success" />
            </div>
            <h1 className="thankyou-title">Thank You for Subscribing!</h1>
            <p className="thankyou-message">
              You're now part of our community. Keep an eye on your inbox for exciting updates and offers.
            </p>
            {/* <p className="thankyou-countdown">
              Redirecting to homepage in <strong>{seconds}</strong> seconds...
            </p> */}
            <Button href="/login" style={{backgroundColor:"ffc300"}} className="btn-warning fw-bold rounded">
               Log in Now
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default SuccessPage;
