import { BrowserRouter } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import './scss/style.scss';
import './scss/examples.scss';
import AppRoutes from './routes';
import { Spinner } from 'react-bootstrap';
import { GeneralProvider } from './Context/GeneralContext';
import { CartProvider } from './Context/ItemCartContext';
import { TransferProvider } from './Context/TransferContext';

const App = () => {

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading ? (
        <div className="d-flex justify-content-center " style={{ marginTop: '20%' }}>
          <Spinner animation="grow" variant="secondary" size="sm" />
          <Spinner animation="grow" variant="warning" />
          <Spinner animation="grow" variant="secondary" size="sm" />
          <Spinner animation="grow" variant="warning" />
        </div>
      ) : (
        <BrowserRouter>
            <CartProvider>
          <GeneralProvider>
            <TransferProvider>

              <AppRoutes />
            </TransferProvider>
          </GeneralProvider>
            </CartProvider>
        </BrowserRouter>
      )}
    </>
  );
};

export default App;
