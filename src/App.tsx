import React from 'react';
import Categories from './pages/Categories';
import './App.css';
import { ChakraProvider, CSSReset } from '@chakra-ui/core';
import Layout from './components/Layout';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Login from './pages/Login';
import theme from '@chakra-ui/theme';

function App() {
  return (
    <>
      <ChakraProvider theme={theme}>
        <CSSReset />
        <Router>
          <Layout>
            <Switch>
              <Route path='/categories'>
                <Categories />
              </Route>
              <Route path='/login'>
                <Login />
              </Route>
            </Switch>
          </Layout>
        </Router>
      </ChakraProvider>
    </>
  );
}

export default App;
