import React from 'react';
import $ from 'jquery';

export class Auth {
    getAuth(callback) {
        $.ajax({
            url: '/auth',
            type: 'GET',
            success: (response) => {
                this.loggedIn = response.auth.loggedIn;
                this.user = response.auth.user;
                if (typeof this.updateAuth === 'function') {
                    this.updateAuth(response.auth.user);
                }
                if (typeof callback === 'function') {
                    callback(response);
                }
            },
            error: (errors) => {
                this.error = Helper.getFirstError(errors);
                this.loggedIn = false;
                if (typeof this.updateAuth === 'function') {
                    this.updateAuth({loggedIn: false});
                }
                if (typeof callback === 'function') {
                    callback({loggedIn: false});
                }
            }
        });
    }

    onChange(func) {
        this.updateAuth = func;
    }

    login(credential, callback) {
        console.log('login');
        console.log('credential, callback', credential, callback);
        $.ajax({
            url: '/login',
            method: 'POST',
            data: credential,
            success: (response) => {
                this.loggedIn = true;
                this.user = response.user;
                if (typeof this.updateAuth === 'function') {
                    this.updateAuth(response.user);
                }
                if (typeof callback === 'function') {
                    callback(null);
                }
            },
            error: (response) => {
                this.loggedIn = false;
                this.user = null;
                if (typeof callback === 'function') {
                    callback(response.responseJSON);
                }
            }
        });
    }
}

export const persistAuth = (ComposedComponent, auth) => class PersistAuth extends React.Component {
    render() {
        return <ComposedComponent {...this.props} auth={auth} />
    }
}

export default Auth;
