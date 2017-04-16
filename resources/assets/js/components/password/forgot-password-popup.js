import React from 'react';
import {withRouter} from 'react-router';
import $ from 'jquery';
import toastr from 'toastr';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import IconClear from 'material-ui/svg-icons/content/clear';

const style = {
    paper: {
        width: '600px',
        maxWidth: '80%'
    }
}

class ForgotPassword extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            data: {},
            errors: {},
            processing: false
        };
    }

    onTextFieldChanged(attr, event) {
        let data = this.state.data;
        data[attr] = event.target.value;
        this.setState({data});
    }

    onSave() {
        this.setState({processing: true})
        $.ajax({
            url: '/password/email',
            type: 'POST',
            data: this.state.data,
            success: (response) => {
                toastr.success(response);
                this.onClose();
            },
            error: (response) => this.setState({
                errors: response.responseJSON,
                processing: false
            })
        });
    }

    onClose() {
        this.props.router.push('login');
    }

    componentDidMount() {
        this.refs.email.focus();
    }

    render() {
        return (
            <div className="forgot-password">
                <div className="paper cast-simple-shadow" style={style.paper}>
                    <div className="header tinted">
                        Password Reset
                        <div className="close-btn" onClick={this.onClose.bind(this)}>
                            <IconClear style={{fill: '#FFF'}}/>
                        </div>
                    </div>
                    <div className="body">
                        <div style={{display:'flex', alignItems:'center'}}>
                            <div className="col-md-2" style={{textAlign:'right'}}>
                                Email
                            </div>
                            <div className="col-md-10">
                                <TextField ref="email" name="email" type="text" fullWidth={true}
                                    value={this.state.data['email'] || ''}
                                    onChange={this.onTextFieldChanged.bind(this, 'email')}
                                    errorText={this.state.errors['email']} errorStyle={{textAlign:'left'}}
                                />
                            </div>
                        </div>
                        <div style={{textAlign:'center', margin:'20px'}}>
                            <RaisedButton label="Send" primary={true} style={{marginRight:'10px'}}
                                onClick={this.onSave.bind(this)} disabled={this.state.processing}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(ForgotPassword);
