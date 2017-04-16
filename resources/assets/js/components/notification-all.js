import $ from 'jquery';
import _ from 'lodash';
import React from 'react';
import toastr from 'toastr';
import {withRouter} from 'react-router';
import autobind from 'react-autobind';
import moment from 'moment';
import Config from '../config';

class NotificationAll extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);

        this.state = {
            notifications: [],
            processingMessage: null
        };
    }

    componentWillMount() {
        this.getNotifications();
    }

    getNotifications() {
        $.ajax({
            url: '/notifications',
            type: 'GET',
            success: (response) => {
                this.setState({notifications: response.notifications})
            }
        });
    }

    clearNotification(done) {
        $.ajax({
            url: 'notifications/clear',
            type: 'POST',
            success: (notifications) => {
                this.setState({notifications});
                done();
            },
            error: (error) => {
                toastr.error(Helper.getFirstError(error));
            }
        });
    }

    handleMarkAllClick() {
        this.setState({processingMessage: '*'});
        this.context.app.clearNotification(() => {
            this.setState({processingMessage: null});
        });
    }

    onMessageClick(url) {
        if (url && !this.mouseDownOnDismiss) {
            let notificationUrl = this.props.router.createHref(url);
            window.open(notificationUrl);
        }
    }

    dismissNotification(id, done) {
        $.ajax({
            url: `notifications/${id}`,
            type: 'PUT',
            success: (notification) => {
                let notifications =  this.state.notifications;
                let index = _.findIndex(notifications, {id});
                notifications[index] = notification;
                this.setState({ notifications });
            },
            error: (error) => {
                toastr.error(Helper.getFirstError(error));
            },
            complete: done
        });
    }

    dismiss(id) {
        this.mouseDownOnDismiss = true;
        if (this.state.processingMessage === null) {
            this.setState({processingMessage: id});
            this.dismissNotification(id, () => {
                this.setState({processingMessage: null});
            });
        }
    }

    countUnreadMessage(messages) {
        let seenMessage = _.filter(messages, {is_read: false}); // eslint-disable-line
        return seenMessage.length || 0;
    }

    render() {
        let messages = this.state.notifications;

        if (!messages) {
            return null;
        }

        let messageTypes = {};

        messageTypes[Config.notification.type.INFO] = 'info';
        messageTypes[Config.notification.type.WARNING] = 'warning';
        messageTypes[Config.notification.type.ERROR] = 'error';

        let notificationCount = messages.length,
            processingMessage = this.state.processingMessage,
            clearInProgress = this.state.processingMessage == '*',
            unReadCount = this.countUnreadMessage(messages);

        return (
            <div className="contents" id="main-content">
                <div className='notification-all'>
                    <div className='notification-header'>
                        <span className='header-left'>Your Notification</span>
                        {unReadCount ?  <span className="header-right clear" onClick={this.handleMarkAllClick}>Mark all as read</span> : null}
                    </div>
                    <div className='messages' ref="messageContainer">
                        {notificationCount > 0 ?
                            <div>
                                <ul className={processingMessage !== null ? 'working' : ''} ref="messageList">
                                    {messages.map((message) =>
                                        <li
                                            key={message.id}
                                            onClick={this.onMessageClick.bind(this, message.url)}
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
                            </div> :
                            <div className="no-item">No new notification</div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

NotificationAll.contextTypes = {
    app: React.PropTypes.object
}

NotificationAll.propTypes = {
    icon: React.PropTypes.element,
    messages: React.PropTypes.array,
    styles: React.PropTypes.object,
    onDismiss: React.PropTypes.func,
    onClear: React.PropTypes.func
}

NotificationAll.defaultProps = {
    icon: <i className="material-icons">notifications</i>,
    messages: [],
    styles: {}
}

export default withRouter(NotificationAll);
