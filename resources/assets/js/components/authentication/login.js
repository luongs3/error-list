import React from 'react';
import {withRouter, Link} from 'react-router';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import autobind from 'react-autobind';
import $ from 'jquery';
import toastr from 'toastr';
import Config from '../../config';

class Login extends React.Component {
    constructor(props){
        super(props);
        autobind(this);

        this.state = {
            email: '',
            password: '',
            errors: {},
            loginDisabled: true
        };

        autobind(this);
        this.redirectAfterLogin = this.props.route.redirect || '';
    }

    validateLogin(data) {
        return data.email.length > 0 && data.password.length > 0;
    }

    login() {
        let email = this.state.email.trim(),
            password = this.state.password;

        if (!this.validateLogin({email, password})) {
            return;
        }

        this.context.app.login({email, password}, (errors) => {
            if (errors) {
                this.setState({errors})
            } else {
                this.props.router.push(this.redirectAfterLogin);
            }
        });
    }

    shouldBeSendEmail(event) {
        let email = this.refs.email.getValue();
        if (email.length > 0 && this.state.password.length == 0) {
            event.preventDefault();
            this.sendEmailForgotPassword(email);
        }
    }

    sendEmailForgotPassword(email) {
        $.ajax({
            url: '/password/email',
            type: 'POST',
            data: {email},
            success: (response) => {
                toastr.success(response);
            },
            error: (response) => this.setState({
                errors: response.responseJSON
            })
        });
    }

    onTextFieldChange(attr, event) {
        let state = {};
        state[attr] = event.target.value;
        this.setState(state, () => {
            this.setState({loginDisabled: !this.validateLogin(this.state)});
        });
    }

    onKeyDown(event) {
        if (event.keyCode == 13) {
            this.login();
        }
    }

    componentDidMount() {
        let auth = this.context.auth;
        if (auth && auth.loggedIn) {
            this.props.router.push(this.redirectAfterLogin);
        } else {
            this.refs.email.focus();
        }
    }

    render() {
        console.log('login');
        let auth = this.context.auth,
            title = this.props.route.title,
            framgiaLogo = Config.framgiaWhiteLogo;

        if (auth && auth.loggedIn) {
            return null;
        }

        return (
            <div className="login">
                <img className="framgia-icon" src={framgiaLogo} />
                <div className="login-title">
                    <div className="title">{title}</div>
                    <hr className="underline" />
                </div>
                <div className="login-box">
                    <div className="login-form">
                        <div className="row">
                            <div className="title">Email<span className="required"/></div>
                            <TextField
                                className="login-input email"
                                name="username"
                                type="text"
                                value={this.state.email}
                                ref="email"
                                hintText="Enter your email"
                                fullWidth={true}
                                underlineShow={false}
                                errorStyle={{textAlign: 'left'}}
                                errorText={this.state.errors.email || this.state.errors.error}
                                onChange={this.onTextFieldChange.bind(this, 'email')} onKeyDown={this.onKeyDown}
                            />
                        </div>
                        <div className="row">
                            <div className="title">Password<span className="required"/></div>
                                <TextField
                                    className="login-input password"
                                    name="password"
                                    type="password"
                                    value={this.state.password}
                                    hintText="Enter your password"
                                    fullWidth={true}
                                    underlineShow={false}
                                    errorStyle={{textAlign: 'left'}}
                                    errorText={this.state.errors.password}
                                    onChange={this.onTextFieldChange.bind(this, 'password')} onKeyDown={this.onKeyDown}
                                />
                        </div>
                    </div>
                    <div className="login-forgot-password">
                        <Link to="/password/email" onClick={this.shouldBeSendEmail}>Forgot your password?</Link>
                    </div>
                    <RaisedButton
                        className="btn-login btn"
                        label="Login"
                        primary={true}
                        onClick={this.login}
                        disabled={this.state.loginDisabled}
                    />
               </div>
            </div>
        );
    }
}

Login.contextTypes = {
    app: React.PropTypes.object
}

export default withRouter(Login);
