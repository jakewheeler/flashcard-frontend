import React from 'react';
import Library from './pages/Library';
import { ChakraProvider, CSSReset } from '@chakra-ui/core';
import Layout from './components/Layout';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import theme from '@chakra-ui/theme';
import Home from './pages/Home';
import { useStoredUser } from './hooks';
import { PrivateRoute } from './components/PrivateRoute';

function App() {
  const isLoading = useStoredUser();

  if (isLoading) return null;

  return (
    <>
      <ChakraProvider theme={theme}>
        <CSSReset />
        <Router>
          <Layout>
            <Switch>
              <Route exact path='/' component={Home} />
              <PrivateRoute exact path='/library' component={Library} />
              <Route exact path='/login' component={Login} />
              <Route exact path='/signup' component={SignUp} />
            </Switch>
          </Layout>
        </Router>
      </ChakraProvider>
    </>
  );
}

export default App;
