import React from 'react';
import ReactDOM from 'react-dom';
import {Route, IndexRedirect, IndexRoute, Router, Redirect, hashHistory} from 'react-router';
import $ from 'jquery';
import toastr from 'toastr';
import Helper from '../commons/Helper';
import {Auth, persistAuth} from '../commons/Auth';

import App from './app';
import Login from '../components/authentication/login';
import RegisterForm from '../components/password/register-form';
import Errors from './containers/errors';

$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $("meta[name='_token']").attr('content')
    }
});

window.Helper = Helper;
let auth = new Auth();

function requireAuth(nextState, replace) {
    if (auth.loggedIn === false) {
        if (auth.error) {
            toastr.error(auth.error);
            auth.error = null;
        }

        replace({
            pathname: '/login',
            state: {
                returnUrl: nextState.location.pathname
            }
        });
    }
}

function authenticated(nextState, replace) {
    if (auth.loggedIn && auth.user) {
        replace({
            pathname: '/'
        });
    }
}

const routers = (
    <Router history={hashHistory}>
        <Route path='/' component={persistAuth(App, auth)}>
            <Route path='login' component={Login} type="admin" title="Awsesome Teacher Admin Login" redirect='' onEnter={authenticated}/>
            <Route path='register/:token' component={RegisterForm} onEnter={authenticated}/>
            <Route path='' onEnter={requireAuth}>
                <IndexRedirect to='errors'/>

                <Route path='errors'>
                    <IndexRoute component={Errors} />
                </Route>
            </Route>
        </Route>
    </Router>
);

auth.getAuth(() => {
    ReactDOM.render(routers, document.getElementById('app'));
});
