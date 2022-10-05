import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

/* ====== Prime React Configuration ====== */
import "primereact/resources/themes/bootstrap4-light-blue/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
