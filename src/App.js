import React, { Component } from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';
import './App.css';
import Home from './components/Home/Home';
import Private from './components/Private/Private';

class App extends Component 
{
  render() 
  {
    return (
      <HashRouter>
        <Switch>
          <Route exact path='/' component={ Home } />
          <Route path='/private' component={ Private } />
        </Switch>
      </HashRouter>
    );
  }
}

export default App;
