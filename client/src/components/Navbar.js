import React from 'react';
import M from 'materialize-css/dist/js/materialize.min.js';
import { Navbar as Nav, Icon } from 'react-materialize';
import { useAuth } from '../utils/context';
import { apiAuth } from '../utils/api';

export function Navbar() {
  // Activate SideNav behavior
  function _componentDidMount() {
    var elem = document.querySelector('.sidenav');
    var instance = M.Sidenav.init(elem, {
      edge: 'left',
      inDuration: 250,
    });
  }

  const { auth } = useAuth();
  
  return (
    <>
      <header>
        <Nav
          componentDidMount={_componentDidMount}
          alignLinks='right'
          centerLogo={true}
          brand={
            <a className='brand-logo' href='/'>
              <span style={{ color: 'green' }}>Fake</span>
              <span style={{ color: 'Red' }}>Trade</span>
            </a>
          }
          id='mobile-nav'
          menuIcon={<Icon>menu</Icon>}
          options={{
            draggable: true,
            edge: 'left',
            inDuration: 250,
            onCloseEnd: null,
            onCloseStart: null,
            onOpenEnd: null,
            onOpenStart: null,
            outDuration: 200,
            preventScrolling: true,
          }}
          sidenav={
            <ul>
              {auth ? (
                <>
                  <li>
                    <a href='/dashboard'>My Dashboard</a>
                  </li>
                  <li>
                    <a href='/cashmanagement'>Cash Management</a>
                  </li>
                  <li>
                    <a onClick={apiAuth.logout}>Logout</a>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <a href='/login'>Login</a>
                  </li>
                  <li>
                    <a href='/register'>Sign Up</a>
                  </li>
                </>
              )}
            </ul>
          }
        >
          {auth ? (
            <ul>
              <li>
                <a href='/dashboard'>My Dashboard</a>
              </li>
              <li>
                <a href='/cashmanagement'>Cash Management</a>
              </li>
              <li>
                <a onClick={apiAuth.logout}>Logout</a>
              </li>
            </ul>
          ) : (
            <ul>
              <li>
                <a href='/login'>Login</a>
              </li>
              <li>
                <a href='/register'>Sign Up</a>
              </li>
            </ul>
          )}
        </Nav>
      </header>
    </>
  );
}
