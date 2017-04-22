import React from 'react';
import autobind from 'react-autobind';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Header from './components/header'
import Navigation from './components/navigation';
import {white, grey700} from 'material-ui/styles/colors'
import $ from 'jquery'
import _ from 'lodash'
import toastr from 'toastr'

const mainColor = '#00BBE5';
const customTheme = {
    palette: {
        primary1Color: mainColor,
        primary2Color: mainColor,
        accent1Color: mainColor
    },
    appBar: {
        color: white,
        textColor: mainColor
    },
    flatButton: {
        secondaryTextColor: grey700
    },
    tableHeaderColumn: {
        textColor: white,
        height: '46px'
    },
    tableRow: {
        stripeColor: '#EFEFEF'
    },
    inkBar: {
        backgroundColor: white
    }
}

const muiTheme = getMuiTheme(customTheme);

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            auth: props.auth.user,
            passwordDialogOpen: false,
            profileDialogOpen: false,
            notifications: []
        }

        this.headerContents = null;
        this.reload = {};
        this.store = {};

        autobind(this);
    }

    getChildContext() {
        return {
            app: this,
            auth: this.state.auth
        }
    }

    login(credential, callback) {
        this.props.auth.login(credential, callback);
    }

    getAuth(callback) {
        this.props.auth.getAuth(callback);
    }

    updateAuth(auth) {
        this.setState({ auth})
    }

    setHeaderContents(...components) {
        components = components.map((component, index) => component ? React.cloneElement(component, {key: index}) : null);
        this.headerContents = components;
        this.forceUpdate();
    }

    updateReloadData(type, needReload) {
        this.reload[type] = needReload;
    }

    shouldReload(type) {
        return this.reload[type];
    }

    getStore(key) {
        if (key) {
            return this.store[key] || null;
        }

        return this.store;
    }

    updateStore(key, data) {
        this.store[key] = data;
    }

    onAuthUpdated(auth) {
        this.setState({ auth }, () => {
            if (auth.loggedIn || auth.id) {
                this.getNotifications();
            }
        });
    }

    componentWillMount() {
        let auth = this.props.auth;
        if (auth.loggedIn) {
            this.getNotifications();
        }

        auth.onChange(this.onAuthUpdated);
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

    render() {
        let loggedIn = this.props.auth.loggedIn,
            {auth, notifications} = this.state;

        if (loggedIn === undefined || (loggedIn && !auth)) {
            return null;
        }

        let pathname = this.props.location.pathname;

        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div id="wrapper" className="admin">
                    {loggedIn ? <Navigation pathName={pathname} auth={auth}/> : null}
                    <div className="content-wrapper">
                        {loggedIn ?
                            <Header
                                auth={auth}
                                pathname={this.props.location.pathname}
                                notifications={notifications}
                            >
                                {this.headerContents}
                            </Header>
                            : null
                        }
                        {this.props.children}
                    </div>
                </div>
            </MuiThemeProvider>
        );
    }
}

App.childContextTypes = {
    app: React.PropTypes.object,
    auth: React.PropTypes.object
};

export default App;
