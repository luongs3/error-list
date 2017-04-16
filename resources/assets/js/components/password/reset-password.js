import React from 'react';
import {withRouter} from 'react-router';
import $ from 'jquery';
import toastr from 'toastr';
import PasswordForm from './password-form';

class ResetPassword extends React.Component{
    constructor(props){
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
            url: '/password/reset',
            type: 'POST',
            data,
            success: (response) => {
                this.context.app.getAuth(() => {
                    this.props.router.push('/');
                });
                toastr.success(response);
            },
            error: (response) => {
                let errors = response.responseJSON;
                if (response.status != 422) {
                    toastr.error('Unexpected error happened');
                } else {
                    this.setState({errors});
                }
            },
            complete: () => this.refs.passwordForm.setProcessing(false)
        });
    }

    render() {
        let email = this.props.location.query.email || '';

        return (
            <PasswordForm
                ref="passwordForm"
                title="Reset Password"
                email={email}
                passwordFieldName="password"
                requireOldPassword={false} displayCancel={false}
                errors={this.state.errors} onSave={this.onSave.bind(this)}
            />
        );
    }
}

ResetPassword.contextTypes = {
    app: React.PropTypes.object
}

export default withRouter(ResetPassword);
