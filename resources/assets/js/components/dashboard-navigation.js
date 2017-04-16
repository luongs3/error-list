import React from 'react';
import autobind from 'react-autobind';
import {withRouter} from 'react-router';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import DropdownList from 'react-widgets/lib/DropdownList';
import Checkbox from 'material-ui/Checkbox';
import Config from '../config';
import moment from 'moment';

const universities = Config.universities;
const grades = Config.dashboardGrades;

class DashboardNavigation extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);

        this.state = {
            university: props.university || universities[0],
            grade: props.grade || grades[0],
            dashboardType: props.dashboardType || 'week',
            month: props.month || moment().format('YYYY-MM')
        };
    }

    componentWillReceiveProps(nextProps) {
        let {university, grade, month} = nextProps;
        this.setState({university, grade, month});
    }

    onMonthChange(month) {
        month = moment(month).format('YYYY-MM');

        if (month !== 'Invalid date') {
            this.props.onMonthChange(month);
        }
    }

    onClickNav(type) {
        if (type != this.state.dashboardType) {
            let search = this.props.location.search;
            this.props.router.push(`dashboard/${type}${search}`);
        }
    }

    exportPdf() {
        let {month, university, grade, dashboardType} = this.state;
        let url = `dashboard/${university.id}/${grade.id}/${month}/${dashboardType}`;
        if (dashboardType == 'week') {
            url = `${url}/${this.props.currentWeek}`;
        }

        window.open(`${url}/pdf`, '_blank');
    }

    render() {
        let {university, grade, month, dashboardType} = this.state;
        let {isTeacherPage, isMyLesson} = this.props;
        let maxWeek = Helper.maxWeekOf(this.props.location.query.month);

        return (
                <div className="dashboard-navigation">
                    <div className="header">
                        <div className="title">Dashboard</div>
                        <div className="right">
                            {this.props.showExport ?
                                <div className="export" onClick={this.exportPdf}>
                                    <i className="fa fa-file-pdf-o" aria-hidden="true"/>
                                </div> : null
                            }
                            {this.props.showSwitcher ?
                                <div className="switcher">
                                    <div className={dashboardType === 'month' ? null : 'active'} onClick={this.onClickNav.bind(null, 'month')}>
                                        Month
                                    </div>
                                    <div className={dashboardType === 'month' ? 'active' : null} onClick={this.onClickNav.bind(null, 'week')}>
                                        Week
                                    </div>
                                </div> : null
                            }
                        </div>
                    </div>
                    <div className="filter">
                        <div className="dropdown">
                            <DropdownList
                                data={universities}
                                valueField='id'
                                textField='name'
                                value={university}
                                onChange={(university) => this.props.onUniversityChange(university)}
                            />
                            <DropdownList
                                data={grades}
                                valueField='id'
                                textField='name'
                                value={grade}
                                onChange={(grade) => this.props.onGradeChange(grade)}
                            />
                            <DateTimePicker
                                value={new Date(month)}
                                initialView="year"
                                time={false}
                                format="MMM YYYY"
                                onChange={this.onMonthChange}
                                placeholder="Mar 2017"
                            />
                            {isTeacherPage ?
                                (
                                    <Checkbox
                                        label="My Lesson"
                                        className="checkbox-lesson"
                                        checked={isMyLesson}
                                        iconStyle={{color: 'rgb(85, 85, 85)'}}
                                        labelStyle={{color: 'rgb(85, 85, 85)'}}
                                        onCheck={(event, isInputChecked) => this.props.onIsMyLessonChecked(isInputChecked)}
                                    />
                                ) : null
                            }
                        </div>
                    {this.props.dashboardType != 'month' ?
                        <div className="nav">
                        {this.props.currentWeek == 1 ?
                            <i className='material-icons disabled'>navigate_before</i> :
                            <i className='material-icons' onClick={this.props.previousWeek}>navigate_before</i>
                        }
                            <span> Week {this.props.currentWeek}</span>
                        {this.props.currentWeek == maxWeek ?
                            <i className='material-icons disabled'>navigate_next</i> :
                            <i className='material-icons' onClick={this.props.nextWeek}>navigate_next</i>
                        }
                        </div> : null
                    }
                    </div>
                </div>
        );
    }
}

DashboardNavigation.contextTypes = {
    app: React.PropTypes.object,
    auth: React.PropTypes.object
};

DashboardNavigation.PropTypes = {
    dashboardType: React.PropTypes.string,
    university: React.PropTypes.object,
    grade: React.PropTypes.object,
    month: React.PropTypes.string,
    onUniversityChange: React.PropTypes.func.isRequired,
    onGradeChange: React.PropTypes.func.isRequired,
    onMonthChange: React.PropTypes.func.isRequired,
    showSwitcher: React.PropTypes.boolean,
    showExport: React.PropTypes.boolean
};

DashboardNavigation.defaultProps = {
    showSwitcher: true,
    isTeacherPage: false,
    showExport: false
}

export default withRouter(DashboardNavigation);
