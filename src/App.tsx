import React, { useEffect } from 'react';
import Library from './pages/Library';
import './App.css';
import { ChakraProvider, CSSReset } from '@chakra-ui/core';
import Layout from './components/Layout';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Login from './pages/Login';
import theme from '@chakra-ui/theme';
import Home from './pages/Home';
import useStore from './stores/user';
import { getCategories } from './api/card-service';
import { getDecodedJwt } from './utils';

// check if a stored user already exists and use that for the login
export function useStoredUser() {
  const { setUser, token, user } = useStore();
  useEffect(() => {
    const token = window.localStorage.getItem('token');
    async function authCheck() {
      if (token) {
        try {
          await getCategories(token);
          let user = getDecodedJwt(token).username;
          setUser(user, token);
        } catch (err) {
          console.error('Existing token is not valid');
          setUser('', '');
          window.localStorage.setItem('token', '');
        }
      }
    }
    authCheck();
  }, [token, user, setUser]);
}

function App() {
  useStoredUser();

  return (
    <>
      <ChakraProvider theme={theme}>
        <CSSReset />
        <Router>
          <Layout>
            <Switch>
              <Route exact path='/' component={Home} />
              <Route path='/login' component={Login} />
              <Route exact path='/library' component={Library} />
            </Switch>
          </Layout>
        </Router>
      </ChakraProvider>
    </>
  );
}

export default App;
