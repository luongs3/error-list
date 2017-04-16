import $ from 'jquery';
import React from 'react';
import IconClear from 'material-ui/svg-icons/content/clear';
import Dialog from 'material-ui/Dialog';
import autobind from 'react-autobind';
import Config from '../config';
import moment from 'moment';
import {Link, hashHistory} from 'react-router';
import {RaisedButton} from 'material-ui';
import _ from 'lodash';
import toastr from 'toastr';
import CommentInput from './mention/comment-input';

const customContentStyle = {
    width: '500px',
    maxWidth: 'none'
};

class LessonDialog extends React.Component{
    constructor(props) {
        super(props);
        this.state =  {
            courseClassId: null,
            existData: false,
            classShowLog: {
                lessons: [],
                comments: []
            }
        };

        autobind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.lessonData !== null && nextProps.open && nextProps.lessonData.lessons.length > 0 && !this.state.existData) {
            this.getLessonOfClass(nextProps.lessonData.lessons[0].class_id);
        }
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    scrollToBottom() {
        let element = document.getElementById('activities');
        if (!element) {
            return true;
        }

        let scrollTop = element.scrollHeight - element.clientHeight;
        if (scrollTop > 0) {
            element.scrollTop = scrollTop;
        }
    }

    onEditTeacherClick(teacherId) {
        this.context.app.updateStore('lastLocation', this.props.lastLocation);
        hashHistory.push(`/teachers/${teacherId}/profile`);
    }

    handleCloseDialog() {
        this.setState({
            existData: false,
            classShowLog: {
                lessons: [],
                comments: []
            }
        }, () => {
            this.props.handleCloseDialog();
        });
    }

    mentionInputOnChange(event, commentValue) {
        this.setState({commentValue});
    }

    onSelectClass(courseClassId) {
        this.getLessonOfClass(courseClassId);
    }

    getLessonOfClass(courseClassId) {
        $.ajax({
            url: `activities/${courseClassId}`,
            type: 'get',
            success: (classShowLog) => {
                this.setState({classShowLog, courseClassId, existData: true});
            },
            errors: (errors) => {
                toastr.error(Helper.getFirstError(errors));
            }
        });
    }

    renderLessonLogs(lesson) {

        let logs = lesson.lesson_logs;
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

        return (
            <div className="lesson-log" key={lesson.id}>
                <div className="lesson-name">
                    <span>Lesson:</span>
                    <span className="name">{lesson.content}</span>
                </div>
                <div className="lesson-day">
                    <span><i className="fa fa-clock-o"></i> {lesson.day}</span>
                </div>
                {logElements.length ? logElements : (<span>No log</span>)}
            </div>
        );
    }

    renderComment(comment) {

        let avatar = comment.userable.avatar || 'image/default-avatar.gif';
        let backgoundStyle = {
            backgroundImage: `url(${avatar})`
        };

        let link = comment.userable_type === 'App\Entities\Admin' ?
            '/teachers/{id}/profile'
            : 'admins/{id}/edit';

        return (
            <div className="lesson-comment" key={comment.id}>
                { this.props.isAdmin ?
                    <Link to={link.replace('{id}', comment.userable.id)} className="user">
                        <div className="avatar" style={backgoundStyle} />
                        <span className="name">
                            {Helper.getUserName(comment.userable)}
                        </span>
                    </Link>
                    :
                    <div className="user">
                        <div className="avatar" style={backgoundStyle} />
                        <span className="name">
                            {Helper.getUserName(comment.userable)}
                        </span>
                    </div>
                }
                <div className="comment">
                    <span dangerouslySetInnerHTML={{__html: comment.content}} />
                </div>
            </div>
        );
    }

    handleSubmit(content) {
        let courseClassId = this.state.courseClassId;

        $.ajax({
            url: `activities/${courseClassId}/comment`,
            type: 'post',
            data: {content},
            success: (classShowLog) => {
                this.setState({classShowLog, courseClassId});
            },
            errors: (errors) => {
                toastr.error(Helper.getFirstError(errors));
            }
        });
    }

    renderActivities() {
        const {lessons, comments} = this.state.classShowLog;
        let activities = [];
        let now = moment().format('YYYY-MM-DD');

        let i,
            iLesson = 0,
            lessonsLength = lessons.length,
            iComment = 0,
            commentsLength = comments.length;

        while (iComment < commentsLength && iLesson < lessonsLength) {
            let lessonTime = moment(lessons[iLesson].day).format('YYYY-MM-DD');
            let commentTime = moment(comments[iComment].created_at).format('YYYY-MM-DD');
            if (lessonTime < commentTime) {
                if (lessonTime <= now) {
                    activities.push(this.renderLessonLogs(lessons[iLesson]));
                }

                iLesson++;
            } else {
                activities.push(this.renderComment(comments[iComment]));
                iComment++;
            }
        }

        if (iComment < commentsLength) {
            for (i = iComment; i < commentsLength; i++) {
                activities.push(this.renderComment(comments[i]));
            }
        }

        if (iLesson < lessonsLength) {
            for (i = iLesson; i < lessonsLength; i++) {
                let lessonTime = moment(lessons[iLesson].day).format('YYYY-MM-DD');
                if (lessonTime <= now) {
                    activities.push(this.renderLessonLogs(lessons[i]));
                }
            }
        }

        if (activities.length === 0) {
            return (<div className="no-log">No log</div>);
        }

        return activities;
    }

    renderLesson(lesson) {
        let courseClass = lesson.course_class;
        let course = this.props.lessonData.course;
        let avatar = lesson.teacher.avatar || 'image/default-avatar.gif';
        let backgoundStyle = {
            backgroundImage: `url(${avatar})`
        };

        return (
                <div className="row class-detail" key={lesson.id}>
                    <div className="col-md-6 class-room" onClick={this.onSelectClass.bind(this, courseClass.id)}>
                        <div className="row info-group">
                            <div className="col-sm-4">
                                <label>Class</label>
                            </div>
                            <div className="col-sm-8 class-info">
                                <span>{courseClass.name}</span>
                            </div>
                        </div>
                        <div className="row info-group">
                            <div className="col-sm-4">
                                <label>Room</label>
                            </div>
                            <div className="col-sm-8 class-info">
                                <span>{lesson.room}</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 class-info">
                        { this.props.isAdmin ?
                            <span onClick={this.onEditTeacherClick.bind(this, lesson.teacher.id)} className="teacher-detail">
                                <div className="avatar-cicle" style={backgoundStyle}/>
                                <span>{Helper.getUserName(lesson.teacher)}</span>
                            </span>
                            :
                            <div className="teacher-detail">
                                <div className="avatar-cicle" style={backgoundStyle}/>
                                <span>{Helper.getUserName(lesson.teacher)}</span>
                            </div>
                        }
                    </div>
                    {this.props.editable ? (<div className="col-md-12">
                        <div className="action" style={{textAlign: 'right'}}>
                            <Link to={`/courses/${course.id}/classes/${courseClass.id}/lessons/${lesson.id}/edit`}>
                                <RaisedButton primary={true} label="edit lesson"/>
                            </Link>
                        </div>
                    </div>) : null}
                </div>
        );
    }

    renderLessons(lessons) {
        return lessons.map((lesson) => this.renderLesson(lesson));
    }

    render() {
        if (!this.props.lessonData) {
            return null;
        }

        let course = this.props.lessonData.course;
        let lessons = this.props.lessonData.lessons;
        let title = `${_.find(Config.universities, {id: course.university_id}).name} > ${course.name}`;
        let firstLesson = lessons[0];
        let content = firstLesson.content;
        let day = moment(firstLesson.day).format('MM/DD (ddd)');
        let startTime = moment(firstLesson.started_at).format('HH:mm');
        let endTime = moment(firstLesson.ended_at).format('HH:mm');
        let time = `${day} ${startTime} ~ ${endTime}`;

        return (
            <Dialog modal={true} open={this.props.open}
                bodyClassName='main'
                contentStyle={customContentStyle}
                autoScrollBodyContent={true}
                className='dialog lesson-dialog'
                contentClassName="dialog-wrapper"
            >
                <div className='dialog-header clean-header' style={{height: 'initial'}}>
                    <span className='title'>{title}</span>
                    <span className='title title-border-left'>{title}</span>
                    <IconClear className='icon-clear' onClick={this.handleCloseDialog} />
                </div>
                <div className="dialog-body">
                    <div className="row">
                        <div className="lessons col-md-6">
                            <div className="row lesson-detail">
                                <div className="col-md-2">
                                    <label>Time</label>
                                </div>
                                <div className="col-md-10 lesson-info">{time}</div>
                            </div>
                            <div className="row lesson-detail">
                                <div className="col-md-2">
                                    <label>Lesson</label>
                                </div>
                                <div className="col-md-10 lesson-info">
                                    <span dangerouslySetInnerHTML={{__html: Helper.nl2br(content)}} style={{whiteSpace: 'pre-line'}}/>
                                </div>
                            </div>
                            <div>
                                {this.renderLessons(lessons)}
                            </div>
                        </div>
                        <div className="activities col-md-6" id="activities">
                            <div className="logs">
                                {this.renderActivities()}
                            </div>
                            <div className="comment-input">
                                <CommentInput
                                    users={this.props.users}
                                    handleSubmit={this.handleSubmit}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog>
        );
    }
}

LessonDialog.defaultProps = {
    open: false,
    lessonData: null,
    editable: true,
    users: [],
    isAdmin: false
};

LessonDialog.propTypes = {
    open: React.PropTypes.bool,
    users: React.PropTypes.array,
    lessonData: React.PropTypes.object,
    editable: React.PropTypes.bool,
    isAdmin: React.PropTypes.bool
}

LessonDialog.contextTypes = {
    app: React.PropTypes.object
};

export default LessonDialog;
