import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './common/App';
import ContextProvider from './common/Context';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ContextProvider>
   <App/>
  </ContextProvider>
);


