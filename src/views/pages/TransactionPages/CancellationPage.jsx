import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import './CancellationPage.css';

const CancellationPage = () => {
  const navigate = useNavigate();
  const [secondsLeft, setSecondsLeft] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    // const timeout = setTimeout(() => {
    //   navigate('/subscription');
    // }, 5000);

    return () => {
      clearInterval(interval);
    //   clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <div className="cancel-wrapper">
      <Container>
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col md={8} lg={6}>
            <div className="cancel-card shadow-lg glass-card text-center p-5">
              <HiOutlineExclamationCircle className="cancel-icon text-danger mb-3" />
              <h1 className="cancel-title">Subscription Cancelled</h1>
              <p className="cancel-message">
                We’re sorry to see you go. Your subscription has been cancelled.<br />
                {/* You will be redirected in <strong>{secondsLeft}</strong> second{secondsLeft !== 1 && 's'}. */}
              </p>
              <Button  className="btn-danger fw-bold rounded"  href="/subscription">
                Return Now
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CancellationPage;
