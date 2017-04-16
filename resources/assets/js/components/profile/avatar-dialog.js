import React from 'react';
import toastr from 'toastr';
import $ from 'jquery';
import {RaisedButton, Dialog} from 'material-ui';

let profilePicture = {
    width: '200px',
    height: '200px'
}

const styleUpload = {
    border: '1px solid #ccc',
    display: 'inline-block',
    padding: '6px 12px',
    cursor: 'pointer',
    color: 'rgb(136, 14, 79)'
}

class AvatarDialog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            fileUploadOpen: false,
            processingRequest: false,
            statusLogOpen: false,
            currentProfilePicture: null,
            currentProfilePictureData: null
        }
    }

    handleFileChange(ref, event) {
        let file = event.target.files[0];
        let fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onloadend = (event) => {
            this.setState({
                currentProfilePictureData: event.target.result,
                currentProfilePicture: file
            });
        };
    }

    handleFileUploadOpen(open) {
        this.setState({
            fileUploadOpen: open,
            currentProfilePictureData: null,
            currentProfilePicture: null
        });
    }

    updateProfilePicture() {
        let formData = new FormData();
        formData.append('avatar', this.state.currentProfilePicture);

        this.setState({processingRequest: true});
        $.ajax({
            url: 'avatar',
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: (response) => {
                toastr.success('TabProfileContainer picture is successfully changed');
                if (this.props.updateProfile) {
                    this.props.updateProfile(response.user);
                }
            },
            error: (err) => {
                toastr.error(err);
            }
        }).then(() => {
            this.handleFileUploadOpen(false);
            this.setState({processingRequest: false});
        });
    }

    render() {
        let avatar = this.props.profile.avatar;
        return (
            <Dialog
                title="Profile Picture"
                style={{textAlign:'center'}}
                contentStyle={{width: '500px'}}
                actions={[
                    <RaisedButton
                        style={{marginRight:'5px'}} primary={true}
                        label={this.state.processingRequest ? 'Working...' : 'Save'}
                        onClick={this.updateProfilePicture.bind(this, false)}
                        disabled={!this.state.currentProfilePicture || this.state.processingRequest}
                    />,
                    <RaisedButton label="Cancel" onClick={this.handleFileUploadOpen.bind(this, false)}/>
                ]}
                modal={false}
                autoDetectWindowHeight={false}
                open={this.state.fileUploadOpen}
                onRequestClose={this.handleFileUploadOpen.bind(this, false)}
            >
                <div style={{marginBottom: '10px'}}>
                    <img style={profilePicture} src={this.state.currentProfilePictureData || avatar} />
                </div>
                <div>
                    <label htmlFor='file-upload' className="custom-file-upload" style={styleUpload}>
                        <i className="fa fa-cloud-upload"></i> Choose a picture
                    </label>
                    <input style={{display: 'none'}} id="file-upload" type="file"
                        onChange={this.handleFileChange.bind(this, 'profile_picture')}/>
                </div>
            </Dialog>
        );
    }
}

export default AvatarDialog;
