import React from 'react';
import Categories from './pages/Categories';
import './App.css';
import { ChakraProvider, CSSReset } from '@chakra-ui/core';
import Layout from './components/Layout';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Login from './pages/Login';
import theme from '@chakra-ui/theme';
import Decks from './pages/Decks';
import Home from './pages/Home';

function App() {
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
            </Switch>
          </Layout>
        </Router>
      </ChakraProvider>
    </>
  );
}

export default App;
