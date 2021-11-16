import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { authenticationService } from './authentication.service';

export const PrivateRoute = ({ component: Component, roles, t, i18n, ...rest }) => (
    <Route {...rest} render={props => {
        const currentUser = authenticationService.currentUserValue;
        if (!currentUser) {
            // not logged in so redirect to login page with the return url
            let path = window.location.pathname;
            if (path !== '/' && path !== '/auth/login' && path.indexOf('sign_up') === -1) {
                localStorage.setItem('redirected_from',path);
            }
            return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        }

        // check if route is restricted by role
        if (roles && roles.indexOf(currentUser.role) === -1) {
            // role not authorised so redirect to home page
            return <Redirect to={{ pathname: '/'}} />
        }

        // authorised so return component
        return <Component {...props} t={t}  i18n={i18n} />
    }} />
)