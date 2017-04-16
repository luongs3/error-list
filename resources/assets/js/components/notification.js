import $ from 'jquery';
import _ from 'lodash';
import toastr from 'toastr';
import React from 'react'
import {withRouter} from 'react-router'
import autobind from 'react-autobind'
import moment from 'moment'
import Config from '../config';

const universities = Config.universities;
const grades = Config.grades;

class Notification extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);

        this.state = {
            open: false,
            popupAll: false,
            processingMessage: null
        };
    }

    componentDidMount() {
        this.refs.messageContainer.addEventListener('mousedown', () => {
            this.mouseDownOnMessage = true;
        });

        document.addEventListener('mouseup', this.handleMouseUp);
    }

    componentWillUpdate(nextProps) {
        if (this.state.popupAll && nextProps.messages.length === 0) {
            window.setTimeout(this.close);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.popupAll != this.state.popupAll) {
            this.adjustWidthForScroll();
        }
    }

    componentWillUnmount() {
        if (this.state.open) {
            document.removeEventListener('mousedown', this.onClickOutside);
        }

        document.removeEventListener('mouseup', this.handleMouseUp);
    }

    calculatePosition() {
        let container = $(this.refs.messageContainer);
        container.removeClass('right');
        let iconRect = this.refs.icon.getBoundingClientRect();
        let center = (iconRect.left + iconRect.right) / 2,
            right = center - parseInt(container.css('left')) + parseInt(container.css('width'));
        if (right > window.innerWidth) {
            container.addClass('right');
        }
    }

    adjustWidthForScroll() {
        if (this.refs.messageList) {
            let messageList = this.refs.messageList;
            if (this.state.popupAll) {
                let scrollBarWidth = messageList.offsetWidth - messageList.clientWidth;
                messageList.style.paddingRight = '80px'
                messageList.style.marginRight = `-${scrollBarWidth + 80}px`;
            } else {
                messageList.style.paddingRight = 'initial'
                messageList.style.marginRight = 'initial';
            }
        }
    }

    onIconClick() {
        !this.state.open ? this.open() : this.close();
    }

    onBackdropClick() {
        if (!this.mouseDownOnMessage) {
            this.close();
        }
    }

    onKeyPress(e) {
        if (e.keyCode === 27) {
            this.close()
        }
    }

    open() {
        this.setState({open: true});
        this.calculatePosition();
        document.addEventListener('mousedown', this.onClickOutside);
    }

    close() {
        this.setState({open: false, popupAll: false});
        document.removeEventListener('mousedown', this.onClickOutside);
        document.removeEventListener('keyup', this.onKeyPress);
    }

    seeAll() {
        this.setState({open: false});
        document.addEventListener('keyup', this.onKeyPress);
        this.props.router.push('notifications');
    }

    clear() {
        if (this.props.onClear) {
            this.setState({processingMessage: '*'});
            this.props.onClear(() => {
                this.setState({processingMessage: null});
            });
        }
    }

    onClickOutside(e) {
        if (this.refs.icon.contains(e.target)) {
            return;
        }

        if (!this.mouseDownOnMessage && !this.mouseDownOnDismiss) {
            this.close()
        }
    }

    onMessageClick(message) {
        const {target_type: targetType, target_id: targetId, id} = message;
        const pluralTargetType = this.getPluralWord(targetType);

        if (targetType != 'lesson') {
            if (!message.is_read) {
                this.dismiss(message.id)
            }

            return null;
        }

        $.ajax({
            url: `${pluralTargetType}/${targetId}`,
            type: 'GET',
            success: (lesson) => {
                this.dismiss(id);
                this.close();
                const university = _.find(universities, {'id': lesson.course_class.course.university_id}),
                    grade = _.find(grades, {'id': lesson.course_class.course.grade_id}),
                    month = moment(lesson.started_at, 'YYYY-MM-DD hh:mm::ss').format('YYYY-MM');
                this.props.router.push({
                    pathname: 'dashboard/month',
                    query: {
                        university: university.name,
                        grade: grade.id,
                        month,
                        highlight: lesson.id
                    }
                });
            },
            error: (errors) => {
                toastr.error(Helper.getFirstError(errors));
            }
        })
    }

    getPluralWord(word) {
        switch(word) {
            case 'class':
                return 'classes';
            default:
                return `${word}s`;
        }
    }

    dismiss(id) {
        this.mouseDownOnDismiss = true;
        if (this.state.processingMessage === null && this.props.onDismiss) {
            this.setState({processingMessage: id});
            this.props.onDismiss(id, () => {
                this.setState({processingMessage: null});
            });
        }
    }

    handleMouseUp() {
        this.mouseDownOnMessage = false;
        this.mouseDownOnDismiss = false;
    }

    countUnreadMessage(messages) {
        let seenMessage = _.filter(messages, {is_read: false}); // eslint-disable-line
        return seenMessage.length || 0;
    }

    render() {
        let messages = this.props.messages || [];

        let messageTypes = {};

        messageTypes[Config.notification.type.INFO] = 'info';
        messageTypes[Config.notification.type.WARNING] = 'warning';
        messageTypes[Config.notification.type.ERROR] = 'error';

        let notificationCount = messages.length,
            processingMessage = this.state.processingMessage,
            clearInProgress = this.state.processingMessage == '*',
            unReadCount = this.countUnreadMessage(messages);

        return (
            <div className={`notification${this.state.open ? ' open' : ''}`} style={this.props.style}>
                <div className="icon" ref="icon" onClick={this.onIconClick}>
                    {this.props.icon}
                    {unReadCount > 0 ? <div className="unread-count">{unReadCount}</div>: null}
                </div>
                {this.state.popupAll ? <div className="backdrop" ref="backdrop" onClick={this.onBackdropClick}/> : null}
                <div className={`messages${this.state.popupAll ? ' popup-all' : ''}`} ref="messageContainer">
                    {notificationCount > 0 ?
                        <div>
                            <div className="item-count">
                                <div className="item-total">
                                    <span className="notification-counter">{`${notificationCount} Notification${notificationCount > 1 ? 's' : ''}`}</span>
                                    &nbsp;<span className="item-new">{unReadCount ? `(${unReadCount} new${unReadCount > 1 ? 's' : ''})` : null}</span>
                                </div>
                                {unReadCount ?  <div className="clear" onClick={this.clear}>Mark all as read</div> : null}
                            </div>
                                <ul className={processingMessage !== null ? 'working' : ''} ref="messageList">
                                    {messages.map((message) =>
                                        <li
                                            key={message.id}
                                            onClick={this.onMessageClick.bind(this, message)}
                                            className={
                                                `item ${message.is_read ? null : 'not-read'} ${processingMessage == message.id || clearInProgress ? ' working' : ''}`
                                            }
                                        >
                                            <div className={`text ${messageTypes[message.type]}`}>
                                                <span dangerouslySetInnerHTML={{__html: message.message}}></span>
                                            </div>
                                            <div className="small">
                                                <span className="time">
                                                    <i className="time-setting material-icons">settings</i>
                                                    <span className="time-duration">{moment(message.created_at).fromNow()}</span>
                                                </span>
                                                {message.is_read ? null :
                                                    <span className="dismiss" onClick={this.dismiss.bind(this, message.id)}>
                                                        {processingMessage == message.id || clearInProgress ?
                                                            <span><i className="fa fa-spin fa-circle-o-notch"/>&nbsp;Working...</span> :
                                                            'Mark as read'
                                                        }
                                                    </span>
                                                }
                                            </div>
                                        </li>
                                    )}
                                </ul>
                            {!this.state.popupAll ?
                                <div className="show-all" onClick={this.seeAll}>See all</div>
                                : null
                            }
                        </div> :
                        <div className="no-item">No new notification</div>
                    }
                </div>
            </div>
        );
    }
}

Notification.propTypes = {
    icon: React.PropTypes.element,
    messages: React.PropTypes.array,
    styles: React.PropTypes.object,
    onDismiss: React.PropTypes.func,
    onClear: React.PropTypes.func
}

Notification.defaultProps = {
    icon: <i className="material-icons">notifications</i>,
    messages: [],
    styles: {}
}

export default withRouter(Notification);
