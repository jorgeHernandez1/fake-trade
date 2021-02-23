import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { AuthProvider } from './utils/context';
import 'materialize-css/dist/css/materialize.min.css';
import './index.css';

ReactDOM.render(
  <AuthProvider>
    <App />
  </AuthProvider>,
  document.getElementById('root')
);
