import React from 'react';
import {withRouter} from 'react-router';
import autobind from 'react-autobind';
import $ from 'jquery';
import toastr from 'toastr';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Config from '../../config';

class ForgotPassword extends React.Component{
    constructor(props){
        super(props);
        autobind(this);
        this.state = {
            email: '',
            errors: {},
            submitDisabled: false
        };
    }

    onTextFieldChanged(attr, event) {
        let email = event.target.value;
        let submitDisabled = Helper.validateEmail(email);

        this.setState({email, submitDisabled});
    }

    onResetPassword() {
        this.setState({submitDisabled: true})
        $.ajax({
            url: '/password/email',
            type: 'POST',
            data: {
                email: this.state.email
            },
            success: (response) => {
                toastr.success(response);
            },
            error: (response) => this.setState({
                errors: response.responseJSON,
                submitDisabled: false
            })
        });
    }

    componentDidMount() {
        this.refs.email.focus();
    }

    render() {
        let framgiaLogo = Config.framgiaWhiteLogo;

        return (
            <div className="login">
                <img className="framgia-icon" src={framgiaLogo} />
                <div className="login-title">
                    <div className="title">Reset Password</div>
                    <hr className="underline" />
                </div>
                <div className="login-notice">
                    Enter your register email and check mailbox to get reset password link
                </div>
                <div className="login-box">
                    <div className="login-form">
                        <div className="row">
                            <div className="title">Email<span className="required"/></div>
                                <TextField
                                    className="login-input email"
                                    name="username"
                                    type="text"
                                    ref="email"
                                    value={this.state.email}
                                    hintText="Enter your email"
                                    fullWidth={true}
                                    underlineShow={false}
                                    errorText={this.state.errors.email || this.state.errors.error}
                                    errorStyle={{textAlign: 'left', height: '12px'}}
                                    onChange={this.onTextFieldChanged.bind(this, 'email')}
                                    onKeyDown={this.onKeyDown}
                                />
                        </div>
                    </div>
                    <RaisedButton className="btn-reset btn" label="Reset" primary={true} onClick={this.onResetPassword}/>
                </div>
            </div>
        );
    }
}

export default withRouter(ForgotPassword);
