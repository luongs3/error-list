import React from 'react';
import autobind from 'react-autobind';
import moment from 'moment';
import {withRouter, Link} from 'react-router';
import $ from 'jquery';
import DashboardDayNavbar from './dashboard-day-navbar'

class LessonsDayTable extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            day: props.day,
            isAdmin: props.isAdmin,
            lessons: props.lessons
        }
    }

    componentWillReceiveProps(nextProps) {
        let {day, lessons} = nextProps;
        this.setState({day, lessons});
    }

    componentDidMount() {
        if (document.getElementsByClassName('close-nav').length == 0) {
            document.getElementById('wrapper').className += ' close-nav';
        }

        document.getElementById('header').style.display = 'none';
    }

    setDay(day) {
        this.props.setDay(day);
    }

    emptyCourseNameIfDuplicate(previousCourseName, currentCourseName) {
        if (previousCourseName == currentCourseName) {
            currentCourseName = '';
        }

        return currentCourseName;
    }

    renderLessonsRow(lesson, previousCourseName) {
        let time = `${lesson.started_at}~${lesson.ended_at}`;
        let avatar = lesson.teacher.avatar || 'image/default-avatar.gif';
        let backgoundStyle = {
            backgroundImage: `url(${avatar})`
        };
        let name = Helper.getUserName(lesson.teacher);
        let currentCourseName = lesson.course.name;
        let courseName = this.emptyCourseNameIfDuplicate(previousCourseName, currentCourseName);

        return (
            <tr key={lesson.id}>
                <td className="lesson-time">{time}</td>
                <td className="course-name">{courseName}</td>
                <td className="course-class-name">{lesson.class.name}</td>
                <td className="teacher">
                    <div className="teacher-detail">
                        <div className="teacher-avatar" style={backgoundStyle}></div>
                        {this.state.isAdmin ?
                            <Link to={`teachers/${lesson.teacher.id}/profile`}>
                                <span className="teacher-name">{name ? name : 'Noname'}</span>
                            </Link> : <span className="teacher-name">{name ? name : 'Noname'}</span>
                        }
                    </div>
                </td>
                <td>
                    {lesson.content.replace(/(\r\n|\n|\r)/gm, '; ')}
                </td>
                <td className="lesson-room">
                    <span>{lesson.room}</span>
                </td>
            </tr>
        );
    }

    renderLessonElements(lessons) {
        let previousCourseName = null;
        const lessonElements = $.map(lessons, (lesson) => {
            let lessonElement = this.renderLessonsRow(lesson, previousCourseName);
            previousCourseName = lesson.course.name;

            return lessonElement
        });

        return lessonElements;
    }

    render() {
        let lessons = this.state.lessons;
        let lessonElements = this.renderLessonElements(lessons);

        return (
            <div id="dashboard-day" style={{height: '100%', margin: '0', border: 'none'}}>
                <div id="day-view">
                    <div className="dashboard-day-navbar">
                        <DashboardDayNavbar
                            day={this.state.day}
                            changeDay={this.setDay}
                            university={this.props.university}
                            grade={this.props.grade}
                        />
                    </div>
                    <div className="day-content">
                        {this.props.inProcess ?
                            null
                            : lessonElements.length === 0 ?
                                <div className="no-detail">Have no detail for: {this.state.day}</div>
                                :
                                <table
                                    id="lessons-day-table"
                                    className="lessons-table"
                                >
                                    <thead className="table-header">
                                        <tr>
                                            <th>Time</th>
                                            <th>Course</th>
                                            <th colSpan="2">Class</th>
                                            <th>Lessons</th>
                                            <th>Room</th>
                                        </tr>
                                    </thead>
                                    <tbody className="table-body table-content">
                                        {lessonElements}
                                    </tbody>
                                </table>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

LessonsDayTable.PropTypes = {
    day: React.PropTypes.string,
    lessons: React.PropTypes.object,
    isAdmin: React.PropTypes.bool,
    inProcess: React.PropTypes.bool,
    setDay: React.PropTypes.func.isRequired,
    university: React.PropTypes.number,
    grade: React.PropTypes.number
};

LessonsDayTable.defaultProps = {
    lessons: [],
    day: moment().format('YYYY-MM-DD'),
    isAdmin: false,
    university: 1,
    grade: 1
};

export default withRouter(LessonsDayTable);
