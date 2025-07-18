import { createRoot } from 'react-dom/client';
import 'core-js';
import App from './App';
import { StrictMode } from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="781047801807-9m92qvki276jff13l0o4bph4hs8cai6a.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
)
