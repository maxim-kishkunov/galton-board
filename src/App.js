import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import HomePage from './components/GaltonBoard/HomePage'


function App() {
    return <div className="App">
        <BrowserRouter>
          <Switch>
            <Route path="/" render={routeProps => <HomePage {...routeProps}/>}/>
  
          </Switch>
        </BrowserRouter>
    </div>
}

export default App;
