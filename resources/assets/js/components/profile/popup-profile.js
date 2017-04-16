import React from 'react';
import autobind from 'react-autobind';
import {Dialog, RaisedButton, TextField, Checkbox} from 'material-ui';
import IconClear from 'material-ui/svg-icons/content/clear';
import toastr from 'toastr';
import $ from 'jquery';
import _ from 'lodash';

const contentStyle = {
    width: 800,
    maxWidth: 'none'
};

const imageInputStyle = {
    cursor: 'pointer',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    width: '100%',
    opacity: 0
};

class PopupProfile extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);

        this.state = {
            profile: _.clone(props.profile),
            currentAvatar: null,
            file: null,
            open: false,
            errorText: ''
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            profile: nextProps.profile,
            open: nextProps.open
        });
    }

    handleUpdateProfile() {
        let profile = this.state.profile;
        let formData = new FormData();

        if (this.state.file) {
            formData.append('avatar', this.state.file);
        }

        formData.append('_method', 'PUT');
        formData.append('first_name', this.refs.firstName.getValue().trim());
        formData.append('last_name', this.refs.lastName.getValue().trim());
        if (this.refs.isSuper) {
            formData.append('isSuper', this.refs.isSuper.state.switched ? 1 : 0);
        }

        $.ajax({
            url: `/admins/${profile.id}/update-profile`,
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: (response) => {
                toastr.success('Admin\'s profile is successfully changed');
                this.setState({errorText: ''});
                this.props.onUpdate(response.admin);
                this.close();
            },
            error: (errors) => {
                this.setState({
                    errorText: Helper.getFirstError(errors)
                });
            }
        });
    }

    handleFileChange(ref, event) {
        let file = event.target.files[0];
        let fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onloadend = (event) => {
            let currentAvatar = event.target.result;
            this.setState({currentAvatar, file});
        };
    }

    close() {
        this.setState({open: false}, () => {
            if (this.props.close) {
                this.props.close();
            }
        });
    }

    render() {
        let profile = this.state.profile;

        return (
            <Dialog
                modal={true}
                open={this.state.open}
                contentStyle={this.props.contentStyle || contentStyle}
                className='dialog popup-form'
                bodyClassName='main'
                onRequestClose={this.close}
            >
                <div className='dialog-header'>
                    <span className='title'>{this.props.title}</span>
                    <IconClear className='icon-clear' onClick={this.close}/>
                </div>
                <div className='dialog-body profile-setting' style={{minHeight: '300px'}}>
                    <div className="left">
                        <div className="avatar" style={{backgroundImage: `url(${this.state.currentAvatar || profile.avatar})`}} />
                        {this.props.changeAvatar ?
                            <RaisedButton
                                fullWidth={true}
                                style={{marginTop: 12}}
                                label="Change avatar"
                                primary={true}
                                containerElement="label"
                            >
                                <input
                                    style={imageInputStyle}
                                    type="file"
                                    onChange={this.handleFileChange.bind(this, 'avatar')}
                                />
                            </RaisedButton> : null
                        }
                    </div>
                    <div className="profile">
                        <div className="row">
                            <div className="col col-md-3 fullname">First name</div>
                            <div className="col col-md-9">
                                <TextField
                                    name="firstName"
                                    ref="firstName"
                                    hintText="Enter your first name"
                                    hintStyle={{bottom: '4px', 'left': '8px'}}
                                    errorText={this.state.errorText}
                                    errorStyle={{marginTop: '8px'}}
                                    className="input-border"
                                    defaultValue={profile.first_name || ''}
                                    fullWidth={true}
                                    underlineShow={false}
                                    style={{height: '36px'}}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col col-md-3 fullname">Last name</div>
                            <div className="col col-md-9">
                                <TextField
                                    name="lastName"
                                    ref="lastName"
                                    hintText="Enter your last name"
                                    hintStyle={{bottom: '4px', 'left': '8px'}}
                                    errorText={this.state.errorText}
                                    errorStyle={{marginTop: '8px'}}
                                    className="input-border"
                                    defaultValue={profile.last_name || ''}
                                    fullWidth={true}
                                    underlineShow={false}
                                    style={{height: '36px'}}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col col-md-3">Email</div>
                            <div className="col col-md-9 profile-info">{profile.email || ''}</div>
                        </div>
                        {this.props.changePermission ?
                            <div className="row">
                                <div className="col col-md-3">Super admin</div>
                                <div className="col col-md-9 profile-info">
                                    <Checkbox defaultChecked={profile.is_super} ref="isSuper"/>
                                </div>
                            </div> : null
                        }
                        <div className="row">
                            <div className="col col-md-9 col-md-offset-3">
                                <RaisedButton label="Update" primary={true} onClick={this.handleUpdateProfile}/>
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog>
        );
    }
}

PopupProfile.contextTypes = {
    app: React.PropTypes.object,
    auth: React.PropTypes.object
};

PopupProfile.propTypes = {
    changePermission: React.PropTypes.bool,
    changeAvatar: React.PropTypes.bool
};

PopupProfile.defaultProps = {
    changePermission: true,
    changeAvatar: true
};

export default PopupProfile;
