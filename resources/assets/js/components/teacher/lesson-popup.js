import React from 'react';
import autobind from 'react-autobind';
import $ from 'jquery';
import toastr from 'toastr';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import moment from 'moment';

export default class LessonPopup extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);

        this.state = {
            open: false,
            lessons: []
        };
    }

    componentWillReceiveProps(nextProps) {
        this.getLessons(nextProps);
    }

    componentWillUnmount() {
        this.setState({lessons: []});
    }

    getLessons(nextProps) {
        let grade = nextProps.selectedGrade;
        if (grade && grade.lesson_ids) {
            let lessonIds = grade.lesson_ids;
            Helper.showSplashScreen();

            $.ajax({
                url: 'lessons',
                type: 'post',
                data: {lessonIds},
                success: (lessons) => {
                    this.setState({lessons});
                },
                error: (errors) => {
                    toastr.error(Helper.getFirstError(errors));
                },
                complete: () => {
                    Helper.hideSplashScreen();
                }
            })
        } else {
            this.setState({lessons: []});
        }
    }

    handleClose() {
        this.setState({lessons: []});
        this.props.onClose();
    }

    render() {
        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={this.handleClose}
            />
        ];
        const grade = this.props.selectedGrade,
            lessons = Array.from(this.state.lessons);
        let day = '';

        if (!grade) {
            return null;
        }

        if (lessons.length > 0) {
            day = lessons[0].day;
        }

        return (
            <Dialog
                className="lesson-popup"
                title="Lessons Detail"
                actions={actions}
                modal={false}
                open={this.props.open}
                onRequestClose={this.handleClose}
            >
                <span className="lesson-popup-date"><b>{day}</b></span>
                <span className="lesson-popup-name"><b>{grade ? grade.name : ''}</b></span>
                <table className="lesson-popup-table table table-bordered table-striped table-hover">
                    <thead className="table-body">
                        <tr>
                            <th colSpan="4">Total</th>
                            <th colSpan="4"></th>
                        </tr>
                    </thead>
                    <tbody className="table-body">
                        <tr>
                            <td>Lesson</td>
                            <td className="text-red">{grade.lesson ? grade.lesson : 0}</td>
                            <td>Time</td>
                            <td className="text-red">{grade.time ? grade.time : 0}</td>
                            <th colSpan="4"></th>
                        </tr>
                    </tbody>
                </table>

                <table className="lesson-popup-table table table-bordered table-striped table-hover">
                    <tbody className="table-body">
                        {this.renderLessons(lessons, grade)}
                    </tbody>
                </table>
            </Dialog>
        );
    }

    renderLessons(lessons, grade) {
        return lessons.map(lesson => (
            <tr key={lesson.id}>
                <td>{moment(lesson.started_at).format('HH:mm')}</td>
                <td>{moment(lesson.ended_at).format('HH:mm')}</td>
                <td>{grade ? grade.name : ''}</td>
                <td>{lesson.room || ''}</td>
                <td colSpan="4">{lesson.content || ''}</td>
            </tr>
        ))
    }
}
