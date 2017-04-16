import React from 'react';
import autobind from 'react-autobind';
import _ from 'lodash';
import Dialog from 'material-ui/Dialog';
import IconClear from 'material-ui/svg-icons/content/clear';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import Checkbox from 'material-ui/Checkbox';
import MenuItem from 'material-ui/MenuItem';

const contentStyle = {
    width: 500,
    maxWidth: 'none'
}

class PopupForm extends React.Component{
    constructor(props){
        super(props);
        autobind(this);

        this.state = {
            open: false,
            data: {}
        }
    }

    textField(props, key, error) {
        let {name, label, type='text', multiLine=false, rows, rowsMax=5} = props

        let errorText = Array.isArray(error) ? error[0] : error,
            hintStyle = multiLine ? {top: '12px'} : undefined;

        return (
            <div key={key}>
                <TextField name={label} type={type} fullWidth={true}
                    value={this.state.data[name] || ''} onChange={this.onTextFieldChanged.bind(this, name)}
                    multiLine={multiLine} rows={multiLine ? rows || 3 : 1} rowsMax={rowsMax}
                    floatingLabelText={this.props.useFloatingLabel ? label : undefined}
                    hintStyle={hintStyle}
                    hintText={!this.props.useFloatingLabel ? label : undefined}
                    errorText={errorText} errorStyle={{textAlign:'left'}}
                />
            </div>
        );
    }

    select(props, key, error) {
        let {name, label, options, selected} = props
        let errorText = Array.isArray(error) ? error[0] : error;

        return (
            <div key={key}>
                <SelectField value={this.state.data[name] || selected} onChange={this.onSelectFieldChanged.bind(this, name)}
                    hintText={label} errorText={errorText} fullWidth={true} maxHeight={300}
                >
                    {options.map((item, index) =>
                         <MenuItem key={index} value={item.value} primaryText={item.text}/>
                    )}
                </SelectField>
            </div>
        );
    }

    checkbox(name, label, key) {
        return (
            <Checkbox label={label} key={key} style={{margin: '10px 0'}}
                checked={this.state.data[name] || false} onCheck={this.onCheckboxChecked.bind(this, name)}
            />
        );
    }

    onTextFieldChanged(attr, event) {
        let data = this.state.data;
        data[attr] = event.target.value;
        this.setState({data});
    }

    onSelectFieldChanged(attr, event, index, value) {
        let data = this.state.data;
        data[attr] = value;
        this.setState({data});
    }

    onCheckboxChecked(attr, event, value) {
        let data = this.state.data;
        data[attr] = value;
        this.setState({data});
    }

    renderInput(field, index, error) {
        switch(field.type) {
            case 'select':
                return this.select(field, index, error);
            case 'checkbox':
                return this.checkbox(field.name, field.label, index);
            default:
                return this.textField(field, index, error);
        }
    }

    onSave() {
        if (this.props.onSave) {
            this.props.onSave(this.state.data);
        }
    }

    open() {
        let nextState = {
            open: true,
            errors: {}
        }
        if (!this.props.saveDisabled) {
            nextState.data = _.clone(this.props.data) || {};
        }
        this.setState(nextState);

        return this;
    }

    close() {
        this.setState({open: false}, () => {
            if (this.props.onClose) {
                this.props.onClose();
            }
        });

        return this;
    }

    onActionClick(action) {
        if (action.type === 'submit') {
            return this.onSave;
        } else if (action.type === 'cancel') {
            return this.close;
        } else {
            return action.onClick;
        }
    }

    setErrors(errors) {
        if (typeof errors === 'object') {
            this.setState({errors});
        }

        return this;
    }

    disableSave(state = true) {
        this.setState({saveDisabled: state});

        return this;
    }

    enableSave() {
        this.setState({saveDisabled: false});
    }

    getData() {
        return this.state.data;
    }

    componentWillReceiveProps(nextProps) {
        let nextState = {};
        if (nextProps.data != this.props.data) {
            nextState.data = _.clone(nextProps.data) || {};
        }

        if (nextProps.errors != this.props.errors) {
            nextState.errors = nextProps.errors;
        }

        if (!_.isEmpty(nextState)) {
            this.setState(nextState);
        }
    }

    render(){
        let errors = this.state.errors || {};

        return (
            <Dialog modal={this.props.modal} open={this.state.open}
                contentStyle={this.props.contentStyle || contentStyle}
                className='dialog popup-form'
                bodyClassName='main'
                onRequestClose={this.close}
            >
                <div className='dialog-header'>
                    <span className='title'>{this.props.title}</span>
                    {this.props.showClose ?<IconClear className='icon-clear' onClick={this.close} /> : null}
                </div>
                <div className='dialog-body'>
                    {this.props.children}
                    {this.props.fields.map((field, index) =>
                        this.renderInput(field, index, errors[field.name])
                    )}
                    <div className="actions">
                        {this.props.actions ?
                            this.props.actions.map((action, index) =>
                                <RaisedButton primary={action.primary} label={action.label} key={index}
                                    className="action-btn"
                                    disabled={this.state.saveDisabled} onClick={this.onActionClick(action)}
                                />
                            ) :
                            <RaisedButton primary={true} label={this.props.btnText} className="action-btn full-width"
                                disabled={this.state.saveDisabled || this.props.saveDisabled}
                                onClick={this.onSave}
                            />
                        }
                    </div>
                </div>
            </Dialog>
        );
    }
}

PopupForm.propTypes = {
    title: React.PropTypes.string.isRequired,
    fields: React.PropTypes.array.isRequired,
    modal: React.PropTypes.bool,
    useFloatingLabel: React.PropTypes.bool,
    btnText: React.PropTypes.string,
    contentStyle: React.PropTypes.object,
    data: React.PropTypes.object,
    errors: React.PropTypes.object,
    actions: React.PropTypes.array,
    saveDisabled: React.PropTypes.bool,
    showClose: React.PropTypes.bool,
    onSave: React.PropTypes.func,
    onClose: React.PropTypes.func
}

PopupForm.defaultProps = {
    modal: true,
    useFloatingLabel: false,
    btnText: 'Save',
    saveDisabled: false,
    showClose: true,
    data: {},
    errors: {}
}

export default PopupForm;
