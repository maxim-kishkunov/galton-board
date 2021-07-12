import logo from './logo.svg';
import React, { useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import HomePage from './components/GaltonBoard/HomePage'


function App() {
    return <div className="App">
        <BrowserRouter>    
          {/* {Auth.isLogIn() ? (
              <Navbar t={t} i18n={i18n} history={history}/>
          ):('')} */}
  
          <Switch>
            <Route path="/" render={routeProps => <HomePage {...routeProps}/>}/>
  
          </Switch>
        </BrowserRouter>
    </div>
}

export default App;
