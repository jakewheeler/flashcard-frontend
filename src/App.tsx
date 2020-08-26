import React, { useEffect } from 'react';
import Categories from './pages/Categories';
import './App.css';
import { ChakraProvider, CSSReset } from '@chakra-ui/core';
import Layout from './components/Layout';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Login, { getDecodedJwt } from './pages/Login';
import theme from '@chakra-ui/theme';
import Decks from './pages/Decks';
import Home from './pages/Home';
import Cards from './pages/Cards';
import useStore from './utils/user';
import { getCategories } from './api/cardService';

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
              <Route exact path='/categories' component={Categories} />
              <Route exact path='/categories/:id/decks' component={Decks} />
              <Route
                exact
                path='/categories/:categoryId/decks/:deckId'
                component={Cards}
              />
            </Switch>
          </Layout>
        </Router>
      </ChakraProvider>
    </>
  );
}

export default App;
