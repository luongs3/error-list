import React from 'react'
import IconClear from 'material-ui/svg-icons/content/clear';
import Dialog from 'material-ui/Dialog'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import autobind from 'react-autobind'
import DropdownList from 'react-widgets/lib/DropdownList';
import Config from '../config';

const customContentStyle = {
    width: '500px',
    maxWidth: 'none'
}
const contracts = Config.contracts;

class InviteDialog extends React.Component{
    constructor() {
        super();
        this.state =  {
            open: false,
            saveDisabled: true,
            errors: {
                email: ''
            },
            fullTime: contracts[0]
        }

        autobind(this);
    }

    onContractChange(fullTime) {
        this.setState({fullTime});
    }

    /* eslint-disable */
    sendInvite() {
        let email = this.refs.email.getValue().trim(),
            first_name = this.refs.firstName.getValue().trim(),
            last_name = this.refs.lastName.getValue().trim(),
            full_time = this.state.fullTime.id,
            error = '',
            saveDisabled = false;

        let data = {email, first_name, last_name, full_time};
        if (!Helper.validateEmail(email)) {
            error =  'Invalid email address';
            saveDisabled = true;
            this.setState({
                errors: {email: error},
                saveDisabled
            });

            return;
        }

        if (this.props.onInvite) {
            this.props.onInvite(data);
            this.setState({
                errors: {email: ''},
                saveDisabled: true
            });
        }
    }
    /* eslint-enable */

    onChangeEmail() {
        let email = this.refs.email.getValue().trim(),
            saveDisabled = false;

        if (!Helper.validateEmail(email)) {
            saveDisabled = true;
        }

        this.setState({
            saveDisabled,
            errors: {email: ''}
        });
    }

    setErrors(errors) {
        if (typeof errors === 'object') {
            this.setState({ errors });
        }

        return this;
    }

    disableSave(state = true) {
        this.setState({saveDisabled: state});

        return this;
    }

    handleCloseDialog() {
        this.setErrors({});
        this.props.handleCloseDialog();
    }

    render() {
        let errors = this.state.errors;

        return (
            <Dialog modal={true} open={this.props.open}
                bodyClassName='main'
                contentStyle={customContentStyle}
                className='dialog invite-dialog' >
                <div className='dialog-header clean-header'>
                    <span className='title'>{this.props.title}</span>
                    <IconClear className='icon-clear' onClick={this.handleCloseDialog} />
                </div>
                <div className='dialog-body'>
                    <div className="row">
                        <span className="required" />
                        <TextField
                            ref='firstName'
                            hintText='Enter first name'
                            fullWidth={true}
                            errorText={errors['first_name']}
                        />
                    </div>
                    <div className="row">
                        <span className="required" />
                        <TextField
                            ref='lastName'
                            hintText='Enter last name'
                            fullWidth={true}
                            errorText={errors['last_name']}
                        />
                    </div>
                    <div className="row">
                        <span className="required" />
                        <TextField
                            ref='email'
                            hintText='Enter Email'
                            fullWidth={true}
                            errorText={errors['email']}
                            onChange={this.onChangeEmail}
                        />
                    </div>
                    {this.props.showCheckbox ?
                    <div className="row middle-dropdown" style={{ marginTop: '12px', marginBottom: '24px' }}>
                        <span className="required" />
                        <DropdownList
                            data={contracts}
                            valueField='id'
                            textField='name'
                            className="invite-contract"
                            defaultValue={contracts[0]}
                            onChange={this.onContractChange.bind(this)}
                        />
                    </div> : null
                    }
                    <div className="row middle-dropdown" style={{textAlign: 'center', marginTop: '10px'}}>
                        <RaisedButton
                            className='invite-btn'
                            primary={true}
                            label='Send Invite'
                            disabled={errors.email != '' || this.state.saveDisabled}
                            onClick={this.sendInvite}
                        />
                    </div>
                </div>
            </Dialog>
        )
    }
}

InviteDialog.defaultProps = {
    showCheckbox: false
}

export default InviteDialog;
