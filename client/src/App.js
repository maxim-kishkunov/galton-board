import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { history } from './_helpers/history';
import Auth from './components/auth/Auth';
import { PrivateRoute } from './components/auth/PrivateRoute';
import LoginPage from "./components/auth/LoginPage";
import RegPage from "./components/auth/RegPage";
import './App.css';
import GBHomePage from './components/GaltonBoard/HomePage';
import UserLogin from './components/User/UserLogin';
import HomePage from './components/HomePage';
import Navbar from './components/Navbar/Navbar';

function App() {
  
  return (
    <div className="App">
      <BrowserRouter history={history}>    
        {Auth.isLogIn() ? (
            <Navbar history={history}/>
        ):('')}

        <div className="page-layout-content">
          <Switch>
            <Route path="/sign_up" render={routeProps => <RegPage {...routeProps} />}/>
            <Route path="/group/:token" render={routeProps => <UserLogin {...routeProps} />}/>
            <Route path="/login" render={routeProps => <LoginPage {...routeProps} />}/>
            <PrivateRoute path="/galton-board"  component={GBHomePage} exact />
            <PrivateRoute path="/" component={HomePage} exact />

            <Route path="/galton-board" render={routeProps => <HomePage {...routeProps}/>}/>
          </Switch>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App;
