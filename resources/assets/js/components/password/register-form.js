import React from 'react';
import {withRouter} from 'react-router';
import $ from 'jquery';
import toastr from 'toastr';
import PasswordForm from './password-form';

class Register extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            errors: {}
        }
    }

    onSave(data) {
        data.token = this.props.params.token;
        data.email = this.props.location.query.email || '';
        this.refs.passwordForm.setProcessing();
        $.ajax({
            url: '/password',
            type: 'POST',
            data,
            success: (response) => {
                toastr.success(response);

                this.context.app.login(data, () => {
                    this.props.router.push('/');
                });
            },
            error: (response) => {
                let errors = response.responseJSON;
                if (response.status != 422) {
                    toastr.error(response.responseText);
                } else {
                    if (errors.email) {
                        toastr.error(errors.email);
                    }
                    this.setState({errors});
                }
            },
            complete: () => this.refs.passwordForm.setProcessing(false)
        });
    }

    render() {
        let type = 'Teacher';
        if (window.location.href.indexOf('admin') != -1) {
            type = 'Admin'
        }
        return (
                <PasswordForm
                    ref="passwordForm"
                    title={`You are invited as a <b>${type}</b>. Please set your password!`}
                    passwordFieldName="password"
                    requireOldPassword={false}
                    displayCancel={false}
                    email={this.props.location.query.email || ''}
                    errors={this.state.errors}
                    onSave={this.onSave.bind(this)}
                />
        );
    }
}

Register.contextTypes = {
    app: React.PropTypes.object
}

export default withRouter(Register);
