import React, {Component} from 'react'
import autoBind from 'react-autobind'
import moment from 'moment';
import toastr from 'toastr';
import $ from 'jquery';
import {TextField, RaisedButton} from 'material-ui';

import DropdownList from 'react-widgets/lib/DropdownList';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
momentLocalizer(moment);

class AdvanceSearch extends Component {
    constructor(props) {
        super(props);
        autoBind(this);

        const {advanceConditions} = props;
        this.state = {
            advanceConditions,
            teachers: []
        };
    }

    componentWillMount() {
        this.getTeacherList();
    }

    componentWillReceiveProps(nextProps) {
        const {advanceConditions} = nextProps;
        this.setState({advanceConditions});
    }

    onDateChange(name, value) {
        let {advanceConditions} = this.state;
        advanceConditions[name] = value ? moment(value).format('YYYY-MM-DD') : null;
        this.setState({advanceConditions});
    }

    onStartedAtChange(value) {
        let {advanceConditions} = this.state;
        advanceConditions.startedAt = value ? moment(value).format('HH:mm:ss') : null;
        this.setState({advanceConditions});
    }

    onEndedAtChange(value) {
        let {advanceConditions} = this.state;
        advanceConditions.endedAt = value ? moment(value).format('HH:mm:ss') : null;
        this.setState({advanceConditions});
    }

    onTextFieldChange(name, event, value) {
        let {advanceConditions} = this.state;
        advanceConditions[name] = value;
        this.setState({advanceConditions});
    }

    onTeacherChange(teacher) {
        let {advanceConditions} = this.state;
        advanceConditions['teacher'] = teacher.id;
        this.setState({advanceConditions});
    }

    onClosedClassChecked(event, isActive) {
        this.setState({isActive});
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.onAdvanceSearch(this.state.advanceConditions);
        this.props.onRequestClose();
    }

    handleCancel() {
        this.props.onAdvanceSearchCancel();
    }

    getTeacherList() {
        $.ajax({
            url: '/teachers',
            type: 'GET',
            success: (teachers) => {
                this.setState({teachers});
            },
            error: (errors) => {
                toastr.error(Helper.getFirstError(errors));
            }
        });
    }

    render() {
        let {advanceConditions} = this.state;

        if (!advanceConditions) {
            return null;
        }

        let teachers = this.state.teachers;
        return (
            <div className='advance-search'>
                <div className="row">
                    <div className="col-md-2">
                        <label className="lesson-label" htmlFor="name">Teacher</label>
                    </div>
                    <div className="col-md-10">
                        <DropdownList
                            ref='teacher'
                            textField={item => Helper.getUserName(item)}
                            defaultValue={advanceConditions.teacher || null}
                            valueField='id'
                            minLength={3}
                            placeholder="Click to select teacher"
                            filter='contains'
                            data={teachers}
                            onChange={this.onTeacherChange}
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 col-no-pad">
                        <div className="col-md-4">
                            <label className="lesson-label" htmlFor="startedDate">Start Date</label>
                        </div>
                        <div className="col-md-8">
                            <DateTimePicker
                                className="dt-picker"
                                value={advanceConditions.startedDate ? new Date(advanceConditions.startedDate) : null}
                                format='MM/DD (ddd)'
                                time={false}
                                placeholder="03/20"
                                step={5}
                                onChange={this.onDateChange.bind(this, 'startedDate')}
                            />
                        </div>
                    </div>
                    <div className="col-md-6 col-no-pad">
                        <div className="col-md-4">
                            <label className="lesson-label" htmlFor="endedDate">Finish Date</label>
                        </div>
                        <div className="col-md-8">
                            <DateTimePicker
                                className="dt-picker finish"
                                value={advanceConditions.endedDate ? new Date(moment(advanceConditions.endedDate, 'YYYY-MM-DD')) : null}
                                format='MM/DD (ddd)'
                                time={false}
                                placeholder="03/25"
                                step={5}
                                onChange={this.onDateChange.bind(this, 'endedDate')}
                            />
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-2">
                        <label className="lesson-label" htmlFor="name">Class</label>
                    </div>
                    <div className="col-md-10">
                        <TextField
                            name="courseClass"
                            ref="courseClass"
                            className="input-border"
                            placeholder="Enter Class name"
                            defaultValue={advanceConditions.courseClass}
                            underlineShow={false}
                            fullWidth={true}
                            onChange={this.onTextFieldChange.bind(this, 'courseClass')}
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 col-no-pad">
                        <div className="col-md-4">
                            <label className="lesson-label" htmlFor="startedAt">From</label>
                        </div>
                        <div className="col-md-8">
                            <DateTimePicker
                                className="dt-picker"
                                value={advanceConditions.startedAt ? new Date(moment(advanceConditions.startedAt, 'HH:mm:ss')) : null}
                                format={'HH:mm'}
                                calendar={false}
                                placeholder="09:30"
                                step={5}
                                onChange={this.onStartedAtChange}
                            />
                        </div>
                    </div>
                    <div className="col-md-6 col-no-pad">
                        <div className="col-md-4">
                            <label className="lesson-label" htmlFor="endedAt">To</label>
                        </div>
                        <div className="col-md-8">
                            <DateTimePicker
                                className="dt-picker"
                                value={advanceConditions.endedAt ? new Date(moment(advanceConditions.endedAt, 'HH:mm:ss')) : null}
                                format={'HH:mm'}
                                calendar={false}
                                placeholder="11:00"
                                step={5}
                                onChange={this.onEndedAtChange}
                            />
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-offset-8 col-md-2">
                        <RaisedButton
                            className="btn"
                            style={{marginRight: '24px'}}
                            label="Search"
                            primary={true}
                            onClick={this.handleSubmit}
                        />
                    </div>
                    <div className="col-md-2">
                        <RaisedButton
                            className="btn btn-black"
                            label="Cancel"
                            onClick={this.handleCancel}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

AdvanceSearch.propTypes = {
    onRequestClose: React.PropTypes.func,
    onAdvanceSearch: React.PropTypes.func,
    onAdvanceSearchCancel: React.PropTypes.func,
    advanceConditions: React.PropTypes.object
}


export default AdvanceSearch;
