import React from 'react';
import autobind from 'react-autobind';
import moment from 'moment';
import {withRouter} from 'react-router';
import Helper from '../commons/Helper';

class DashboardDayNavbar extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);

        this.state = {
            day: props.day,
            history: 0
        };
    }

    componentWillReceiveProps(nextProps) {
        let {day} = nextProps;
        this.setState({day});
    }

    previousDay() {
        let previousDay = moment(this.state.day).subtract(1, 'day').format('YYYY-MM-DD');
        this.props.changeDay(previousDay);
    }

    nextDay() {
        let nextDay = moment(this.state.day).add(1, 'day').format('YYYY-MM-DD');
        this.props.changeDay(nextDay);
    }

    goBack() {
        const month = moment(this.state.day).format('YYYY-MM');
        const {university, grade} = this.props;
        const universityName = Helper.getUniversity(university);
        const query = {
            month,
            university: universityName,
            grade
        }

        this.props.router.push({
            pathname: '/dashboard/month',
            query
        });
    }

    render() {
        let day = moment(this.state.day);

        return (
            <div className="nav">
                <div className="title">
                    <span>Dashboard</span>
                </div>
                <div className="navigation">
                    <i className="material-icons" onClick={this.previousDay}>navigate_before</i>
                    <span>{`${day.format('dddd')}(${day.format('MM-DD')})`}</span>
                    <i className="material-icons" onClick={this.nextDay}>navigate_next</i>
                </div>
                <div className="icon-close" onClick={this.goBack}>
                    <i className="fa fa-compress fa-lg" aria-hidden="true"></i>
                </div>
            </div>
        );
    }
}

DashboardDayNavbar.contextTypes = {
    app: React.PropTypes.object,
    auth: React.PropTypes.object
};

DashboardDayNavbar.PropTypes = {
    day: React.PropTypes.string,
    university: React.PropTypes.number,
    grade: React.PropTypes.number
};

export default withRouter(DashboardDayNavbar);
