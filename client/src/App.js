import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { apiAuth } from './utils/api';
import { useAuth } from './utils/context';
import {
  Home,
  Register,
  Login,
  Dashboard,
  CashManagement,
  NoMatch,
} from './pages';
import { Navbar, Footer, PrivateRoute } from './components';
import { Container } from 'react-materialize';

function App() {
  const [state, setState] = useState({
    isReady: false,
  });

  const { auth, setAuth } = useAuth();

  useEffect(() => {
    const res = apiAuth.getAuth();
    if (res) {
      setAuth({ ...auth, ...res });
    }
    setState({ ...state, isReady: true });
  }, []);

  if (!state.isReady) {
    return null;
  }

  return (
    <Router>
      <Navbar />
      <Container>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/login' component={Login} />
          <Route exact path='/register' component={Register} />
          <PrivateRoute exact path='/dashboard' component={Dashboard} />
          <PrivateRoute
            exact
            path='/cashmanagement'
            component={CashManagement}
          />
          <Route component={NoMatch} />
        </Switch>
      </Container>
      <Footer />
    </Router>
  );
}

export default App;
