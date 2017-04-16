import React from 'react';
import autobind from 'react-autobind';
import {TextField, Popover} from 'material-ui';
import $ from 'jquery';
import moment from 'moment';

let timer;

class LessonSearch extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);

        this.state = {
            LessonsPopoverOpen: false,
            lessons: props.lessons || [],
            lesson: null,
            quickSearch: ''
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({lessons: nextProps.lessons, lesson: nextProps.lesson});
    }

    handleLessonsPopoverClose() {
        this.setState({
            LessonsPopoverOpen: false
        });
    }

    handleSelectLesson(lesson) {
        this.setState({
            LessonsPopoverOpen: false,
            quickSearch: lesson.content
        });

        this.refs.lessonValue.input.value = lesson.content;
        this.refs.lessonValue.setState({hasValue: true});
        this.props.onSelectLesson(lesson);
    }

    componentDidMount() {
        let anchorEl = document.getElementById('lesson-value');
        this.setState({anchorEl});
    }

    handleLessonOnChange(event) {
        event.preventDefault();

        clearTimeout(timer); // eslint-disable-line
        timer = setTimeout(() => { // eslint-disable-line
            this.props.search(this.state.anchorEl.value);
        }, 500);
    }

    handleLessonOnFocus(event) {
        event.preventDefault();
        this.setState({
            LessonsPopoverOpen: true,
            anchorEl: event.currentTarget
        });
    }

    renderLesson(lesson) {
        let day = moment(lesson.day).format('DD/MM');
        let time = `${moment(lesson.started_at).format('HH:mm')}~${moment(lesson.ended_at).format('HH:mm')}`;
        return (
            <div className="lesson-element" key={lesson.id} onClick={this.handleSelectLesson.bind(this, lesson)}>
                <div className="row">
                    <div className="col-sm-5">
                        <span className="lesson-content" dangerouslySetInnerHTML={{__html: Helper.nl2br(lesson.content)}}/>
                    </div>
                    <div className="col-sm-3">
                        <span className="lesson-teacher">{Helper.getUserName(lesson.teacher)}</span>
                    </div>
                    <div className="col-sm-2">
                        <span className="lesson-day">{day}</span>
                    </div>
                    <div className="col-sm-2">
                        <span className="lesson-time">{time}</span>
                    </div>
                </div>
            </div>
        )
    }

    renderLessons() {
        let lessons = this.state.lessons;
        if (lessons.length === 0) {
            return (<div className="not-found">Can not find lesson matching</div>);
        }

        let lessonsElement = $.map(lessons, (lesson) => this.renderLesson(lesson));
        return (
            <div className="found">{lessonsElement}</div>
        );
    }

    render() {

        return (
            <div>
                <div className="lesson">
                    <label className="name">
                        <span>Lesson report</span>
                    </label>
                    <div className="value">
                        <TextField
                            id="lesson-value"
                            name="lesson_value"
                            ref="lessonValue"
                            hintText="Enter lesson content or teacher name"
                            className="input-border"
                            fullWidth={true}
                            onChange={this.handleLessonOnChange}
                            onFocus={this.handleLessonOnFocus}
                        />
                        <Popover
                            open={this.state.LessonsPopoverOpen}
                            anchorEl={this.state.anchorEl}
                            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                            targetOrigin={{horizontal: 'left', vertical: 'top'}}
                            onRequestClose={this.handleLessonsPopoverClose}
                            className="lesson-popover"
                            id="lesson-popover"
                        >
                            {this.renderLessons()}
                        </Popover>
                    </div>
                </div>
            </div>
        );
    }
}

LessonSearch.contextTypes = {
    app: React.PropTypes.object,
    auth: React.PropTypes.object
};

LessonSearch.propTypes = {
    lessons: React.PropTypes.array,
    search: React.PropTypes.func,
    onSelectLesson: React.PropTypes.func
}

LessonSearch.defaultProps = {
    lessons: []
}


export default LessonSearch;
