import React from 'react';
import Library from './pages/Library';
import { ChakraProvider, CSSReset } from '@chakra-ui/core';
import Layout from './components/Layout';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import theme from '@chakra-ui/theme';
import Home from './pages/Home';
import { useStoredUser } from './hooks';
import useStore from './stores/user';

function App() {
  useStoredUser();
  let user = useStore((state) => state.user);

  return (
    <>
      <ChakraProvider theme={theme}>
        <CSSReset />
        <Router>
          <Layout>
            <Switch>
              <Route exact path='/' component={Home} />
              <Route exact path='/login'>
                {user ? <Redirect to='/library' /> : <Login />}
              </Route>
              <Route exact path='/signup'>
                {user ? <Redirect to='/library' /> : <SignUp />}
              </Route>
              <Route exact path='/library'>
                {!user ? <Redirect to='/login' /> : <Library />}
              </Route>
            </Switch>
          </Layout>
        </Router>
      </ChakraProvider>
    </>
  );
}

export default App;
