import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Config from '../../config';

class PasswordForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: {},
            processing: false
        }
    }

    onTextFieldChanged(attr, event) {
        let data = this.state.data;
        data[attr] = event.target.value;
        this.setState({data});
    }

    setProcessing(processing = true) {
        this.setState({processing})
    }

    onSave() {
        this.props.onSave(this.state.data);
    }

    onCancel() {
        this.props.onCancel();
    }

    row(name, label) {
        let error = this.props.errors[name] ? this.props.errors[name][0] : undefined,
            hintText = `Enter your ${label}`;

        return (
            <div className="row">
                <div className="title">{label}<span className="required"/></div>
                    <TextField
                        className="login-input password"
                        name={name}
                        type="password"
                        value={this.state.data[name] || ''}
                        hintText={hintText}
                        fullWidth={true}
                        underlineShow={false}
                        errorText={error}
                        errorStyle={{textAlign: 'left'}}
                        onChange={this.onTextFieldChanged.bind(this, name)}
                    />
            </div>
        );
    }

    renderEmail() {
        return this.props.email ? (
            <div style={{display: 'flex', alignItems: 'center', margin: '10px 0'}}>
                <div className="col-md-4">Email</div>
                <div className="col-md-8">{this.props.email}</div>
            </div>
        ) : null;
    }

    render() {
        let title = this.props.title,
            email = this.props.email,
            framgiaLogo = Config.framgiaWhiteLogo;

        return (
            <div className="change-password login">
                <img className="framgia-icon" src={framgiaLogo} />
                <div className="login-title">
                    <div className="title">
                        <div>{email || null}</div>
                        <div dangerouslySetInnerHTML={{__html: title}}></div>
                    </div>
                    <hr className="underline" />
                </div>
                <div className="login-box">
                    <div className="login-form">
                        {this.props.requireOldPassword ?
                            this.row('current_password', 'Current Password') : null
                        }
                        {this.row(this.props.passwordFieldName, 'Password')}
                        {this.row(
                            `${this.props.passwordFieldName}_confirmation`,
                            'Confirm Password'
                        )}
                    </div>

                    <RaisedButton
                        label={'Save'}
                        className="btn-save btn"
                        primary={true}
                        onClick={this.onSave.bind(this)}
                    />
                    {this.props.displayCancel ?
                        <RaisedButton className="btn-save btn" label={'Cancel'} onClick={this.onCancel.bind(this)}/>
                        : null
                    }
               </div>
            </div>
        );
    }
}

PasswordForm.propTypes = {
    requireOldPassword: React.PropTypes.bool,
    displayCancel: React.PropTypes.bool,
    title: React.PropTypes.string,
    passwordFieldName: React.PropTypes.string,
    onSave: React.PropTypes.func.isRequired,
    onCancel: React.PropTypes.func,
    error: React.PropTypes.object
}

PasswordForm.defaultProps = {
    title: 'Change Password',
    requireOldPassword: true,
    displayCancel: true,
    passwordFieldName: 'new_password'
}

export default PasswordForm;
