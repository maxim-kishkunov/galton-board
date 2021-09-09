import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { history } from './_helpers/history';
import Auth from './components/auth/Auth';
import { PrivateRoute } from './components/auth/PrivateRoute';
import LoginPage from "./components/auth/LoginPage";
import RegPage from "./components/auth/RegPage";
import './App.css';
import GBHomePage from './components/GaltonBoard/HomePage';
import HomePage from './components/HomePage';
import Navbar from './components/Navbar/Navbar';


function App() {
  
  const { t, i18n } = useTranslation();
  return (
    <div className="App">
      <BrowserRouter history={history}>    
        {Auth.isLogIn() ? (
            <Navbar t={t} i18n={i18n} history={history}/>
        ):('')}

        <div className="page-layout-content">
          <Switch>
            <Route path="/sign_up" render={routeProps => <RegPage {...routeProps}  t={t}  i18n={i18n}/>}/>
            <Route path="/login" render={routeProps => <LoginPage {...routeProps}  t={t}  i18n={i18n}/>}/>
            <PrivateRoute path="/galton-board" t={t}  i18n={i18n} component={GBHomePage} exact />
            <PrivateRoute path="/" t={t}  i18n={i18n} component={HomePage} exact />

            <Route path="/galton-board" render={routeProps => <HomePage {...routeProps}/>}/>
          </Switch>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App;
