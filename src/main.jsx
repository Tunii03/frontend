import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import { TituloProvider } from './context/TituloContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TituloProvider>
      <App />
    </TituloProvider>
  </React.StrictMode>
);