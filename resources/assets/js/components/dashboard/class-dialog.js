import $ from 'jquery';
import React from 'react';
import moment from 'moment';
import autobind from 'react-autobind';
import Dialog from 'material-ui/Dialog';
import {withRouter, Link, hashHistory} from 'react-router';
import {RaisedButton} from 'material-ui';
import IconClear from 'material-ui/svg-icons/content/clear';

class ClassDialog extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);

        this.state = {
            lessonShowLog: null,
            commentValue: ''
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data) {
            let lessonShowLog = null;
            if (nextProps.data['lessons']) {
                lessonShowLog = nextProps.data['lessons'][0];
            } else {
                lessonShowLog = nextProps.data['lesson'];
            }

            this.setState({lessonShowLog});
        }
    }

    onEditTeacherClick(teacherId) {
        this.context.app.updateStore('lastLocation', this.props.lastLocation);
        hashHistory.push(`/teachers/${teacherId}/profile`);
    }

    handleClose() {
        this.props.onClassDialogClose();
    }

    handleEditClick() {
        const {courseClass} = this.props;
        this.props.router.push(`/courses/${courseClass.courseId}/classes/${courseClass.classId}/edit`);
    }

    getTitle(data) {
        let course = {};
        if (data.lesson) {
            course = data.lesson.course_class.course;
        } else {
            course = data.lessons[0].course_class.course;
        }

        let university = Helper.getUniversity(course.university_id);
        let grade = Helper.getGrade(course.grade_id);

        return `${university} > ${grade} > ${course.name}`;
    }

    renderClasses(lessons) {
        return lessons.map(lesson => {
            let courseClass = lesson.course_class;
            return (
                <div
                    key={lesson.id}
                    className={`class-item ${lesson.id === this.state.lessonShowLog.id ? 'active' : ''}`}
                    onClick={this.handleShowLog.bind(this, lesson)}
                >
                    <div className="lesson-and-time">
                        <div className="row">
                            <div className="col-md-2 title"><b>Time</b></div>
                            <div className="col-md-10 lesson-time">{moment(lesson.started_at).format('YYYY-MM-DD HH:mm')}</div>
                        </div>
                        <div className="row">
                            <div className="col-md-2 title"><b>Lesson</b></div>
                            <div className="col-md-10 lesson-content">
                                <span dangerouslySetInnerHTML={{__html: Helper.nl2br(lesson.content)}} style={{whiteSpace: 'pre-line'}}/>
                            </div>
                        </div>
                    </div>
                    <div className="class-and-room">
                        <div className="row">
                            <div className="col-md-6 class-name-room">
                                <div className="row">
                                    <div className="col-md-4 title"><b>Class</b></div>
                                    <div className="col-md-8 class-name">{courseClass.name}</div>
                                </div>
                                <div className="row">
                                    <div className="col-md-4 title"><b>Room</b></div>
                                    <div className="col-md-8 lesson-room">{lesson.room}</div>
                                </div>
                            </div>
                            <div className="col-md-6 teacher">
                                { this.props.isAdmin ?
                                    <span onClick={this.onEditTeacherClick.bind(this, lesson.teacher.id)} className="teacher-detail">
                                        <div  className='teacher-avatar'>
                                            <img src={lesson.teacher.avatar || '#'} />
                                        </div>
                                        <span>{Helper.getUserName(lesson.teacher)}</span>
                                    </span>
                                    :
                                    <div  className='teacher-detail'>
                                        <div className="teacher-avatar">
                                            <img className='lesson-content-img' src={lesson.teacher.avatar || '#'} />
                                        </div>
                                        <span>{Helper.getUserName(lesson.teacher)}</span>
                                    </div>
                                }
                            </div>
                        </div>
                        {this.props.classEditable ?
                            <div className="edit-lesson row">
                                <Link to={`/courses/${courseClass.course_id}/classes/${courseClass.id}/lessons/${lesson.id}/edit`}>
                                    <RaisedButton className="btn-edit-lesson" primary={true} label="edit lesson"/>
                                </Link>
                            </div> : null
                        }
                    </div>
                </div>
            )
        });
    }

    renderContent(data) {
        let lessons = [];
        if (data['lessons']) {
            lessons = data['lessons'];
        } else {
            lessons = [data['lesson']];
        }

        let classElements = this.renderClasses(lessons);
        return (
            <div className="lesson-class-group">
                <div className="class-group">
                    {classElements}
                </div>
            </div>
        )
    }

    handleShowLog(lessonShowLog){
        this.setState({lessonShowLog});
    }

    mentionInputOnChange(event, commentValue) {
        this.setState({commentValue});
    }

    renderLog() {
        const {lessonShowLog} = this.state;
        if (!lessonShowLog) {
            return (
                <div className="logs">
                    <div className="no-log">No log</div>
                </div>
            );
        }

        let logs = lessonShowLog.lesson_logs;
        let logElements = $.map(logs, (log, i) =>  {
            let time = moment(log.created_at).format('YYYY-MM-DD');
            return(
                <div key={i} className="log-content">
                    <div className="log-message" dangerouslySetInnerHTML={{__html: log.message}} />
                    <div className="log-time">
                        <span>{time}</span>
                    </div>
                </div>
            );
        });
        if (logElements.length === 0) {
            return (
                <div className="logs">
                    <div className="no-log">No log</div>
                </div>
            );
        }

        return (
            <div className="logs">
                {logElements}
            </div>
        );
    }

    render() {
        let {data} = this.props;
        if (!data) {
            return null;
        }

        let title = this.getTitle(data),
            contentElement = this.renderContent(data);
        return (
            <Dialog
                modal={true}
                open={this.props.open}
                onRequestClose={this.handleClose}
                className="class-dialog"
                bodyClassName="dialog-content"
                contentClassName="dialog-wrapper"
            >
                <div className='dialog-header clean-header' style={{height: 'initial'}}>
                    <span className='title' style={{width: '80%'}}>{title}</span>
                    <IconClear className='icon-clear' onClick={this.handleClose} />
                </div>
                <div className="dialog-body">
                    <div className="row">
                        <div className="lesson-list col-xs-6">
                            {contentElement}
                        </div>
                        <div className="lesson-log col-xs-6">
                            {this.renderLog()}
                            <div className="comment-input">

                            </div>
                        </div>
                    </div>
                </div>
            </Dialog>
        );
    }
}

ClassDialog.defaultProps = {
    classEditable: false,
    teachers: [],
    isAdmin: false
}

ClassDialog.propTypes = {
    teachers: React.PropTypes.array,
    classEditable: React.PropTypes.bool,
    isAdmin: React.PropTypes.bool
}

ClassDialog.contextTypes = {
    app: React.PropTypes.object
};

export default withRouter(ClassDialog);
