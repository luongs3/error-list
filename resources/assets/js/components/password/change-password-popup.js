import React from 'react';
import autobind from 'react-autobind';
import $ from 'jquery';
import toastr from 'toastr';
import IconClear from 'material-ui/svg-icons/content/clear';
import {TextField, RaisedButton, Dialog} from 'material-ui';

const customContentStyle = {
    width: '600px',
    maxWidth: 'none'
}

class ResetPassword extends React.Component{
    constructor(props){
        super(props);
        autobind(this);

        this.state = {
            data: {},
            errors: {},
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
        $.ajax({
            url: '/password/change',
            type: 'POST',
            data: this.state.data,
            success: (response) => {
                toastr.success(response.message);
                this.setState({
                    data: {},
                    errors: {}
                });

                this.props.handleCloseDialog();
            },
            error: (response) => {
                let errors = response.responseJSON;
                if (response.status != 422) {
                    toastr.error('Unexpected error happened');
                } else {
                    this.setState({errors});
                }
            }
        });
    }

    onCancel() {
        this.setState({
            data: {},
            errors: {}
        });

        this.props.handleCloseDialog();
    }

    row(name, label) {
        let error = this.state.errors[name] ? this.state.errors[name][0] : undefined;

        return (
            <div className="row">
                <div className="col-md-4">
                    {label}
                </div>
                <div className="col-md-8">
                    <TextField
                        name={name}
                        type="password"
                        fullWidth={true}
                        value={this.state.data[name] || ''}
                        onChange={this.onTextFieldChanged.bind(this, name)}
                        style={{height: '36px'}}
                        errorText={error}
                        errorStyle={{textAlign:'left', marginTop: '8px'}}
                    />
                </div>
            </div>
        );
    }

    render() {
        return (
            <Dialog
                modal={true}
                open={this.props.open}
                bodyClassName='main'
                contentStyle={customContentStyle}
                className='dialog'
            >
                <div className='dialog-header'>
                    <span className='title'>Change password</span>
                    <IconClear className='icon-clear' onClick={this.onCancel} />
                </div>
                <div className='dialog-body change-password'>
                    {this.row('current_password', 'Current Password')}
                    {this.row('new_password', 'New Password')}
                    {this.row('new_password_confirmation', 'Confirm Password')}
                    <div className="row">
                        <div className="col col-md-8 col-md-offset-4">
                            <RaisedButton
                                label={'Update password'}
                                primary={true}
                                style={{marginRight:'10px'}}
                                onClick={this.onSave}
                                disabled={this.state.processing}
                            />
                            <RaisedButton  label={'Cancel'} onClick={this.onCancel} />
                        </div>
                    </div>
                </div>
            </Dialog>
        );
    }
}

export default ResetPassword;
