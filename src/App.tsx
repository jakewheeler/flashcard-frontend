import React from 'react';
import Home from './pages/Home';
import './App.css';
import { ThemeProvider, CSSReset } from '@chakra-ui/core';
import Layout from './components/Layout';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Login from './pages/Login';

function App() {
  return (
    <ThemeProvider>
      <CSSReset />
      <Layout>
        <Router>
          <Link to='/'>Home</Link>
          <Link to='/login'>Login</Link>

          <Switch>
            <Route exact path='/'>
              <Home />
            </Route>
            <Route path='/login'>
              <Login />
            </Route>
          </Switch>
        </Router>
      </Layout>
    </ThemeProvider>
  );
}

export default App;
