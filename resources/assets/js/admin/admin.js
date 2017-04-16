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
import Tag from './containers/tag';
import Errors from './containers/errors';
import NotFound from '../components/not-found';

$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $("meta[name='_token']").attr('content')
    }
});

window.Helper = Helper;
let auth = new Auth();

function requireAuth(nextState, replace) {
        console.log('nextState, replace', nextState, replace);
        console.log('auth', auth);
    if (auth.loggedIn === false) {
        if (auth.error) {
            toastr.error(auth.error);
            auth.error = null;
        }
        console.log('replace');
        replace({
            pathname: '/login',
            state: {
                returnUrl: nextState.location.pathname
            }
        });
    }
}

function authenticated(nextState, replace) {
        console.log('authenticated');
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
                <IndexRedirect to='tags'/>

                <Route path='errors'>
                    <IndexRoute component={Errors} />
                </Route>
                <Route path='tags' component={Tag} />
            </Route>
        </Route>

    </Router>
);

auth.getAuth(() => {
    ReactDOM.render(routers, document.getElementById('app'));
});
