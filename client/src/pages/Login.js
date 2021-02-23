import React, { useState, useEffect } from 'react';
import 'materialize-css';
import { useHistory } from 'react-router-dom';
import { apiAuth } from '../utils/api';
import { useAuth } from '../utils/context';

import { Card, Button, TextInput, Row, Col } from 'react-materialize';

export function Login() {
  const [state, setState] = useState({
    email: '',
    password: '',
    error: '',
  });

  const { auth, setAuth } = useAuth();
  const history = useHistory();

  useEffect(() => {
    if (auth) {
      history.push('/dashboard');
    }
  }, []);

  function _handleChange(event) {
    const { id, value } = event.target;
    setState({ ...state, [id]: value });
  }

  function _handleClick() {

    const { email, password } = state;

    apiAuth
      .login(email, password)
      .then((token) => {
        setAuth({ ...auth, token });
        setTimeout(() => {
          history.push('/dashboard');
        });
      })
      .catch((err) => {
        setState(
          { ...state,
            error: err.toString(),
            password: ''
          });
      });
  }

  return (
    <Row>
      <Col s={12}>
        <Card
          actions={[
            <Button
              id='login-btn'
              onClick={_handleClick}
              node='button'
              style={{
                marginRight: '5px',
                backgroundColor: 'rgb(39, 36, 31)',
              }}
              waves='light'
            >
              login
            </Button>,
          ]}
          className='center black-text'
          title='Login'
        >
          <Row>
            <Col s={12}>
              <TextInput
                s={12}
                email
                id='email'
                label='Email'
                validate
                value={state.email}
                onChange={_handleChange}
              />
            </Col>
            <Col s={12}>
              <TextInput
                s={12}
                id='password'
                label='Password'
                password
                value={state.password}
                onChange={_handleChange}
              />
            </Col>
            <Col s={12}>
                <label className='red-text'>{state.error}</label>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
}
