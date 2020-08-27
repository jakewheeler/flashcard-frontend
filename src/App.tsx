import React from 'react';
import Library from './pages/Library';
import './App.css';
import { ChakraProvider, CSSReset } from '@chakra-ui/core';
import Layout from './components/Layout';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Login from './pages/Login';
import theme from '@chakra-ui/theme';
import Home from './pages/Home';
import { useStoredUser } from './hooks';

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
