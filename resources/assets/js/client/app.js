import React, {Component} from 'react';
import autobind from 'react-autobind';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {white, grey700} from 'material-ui/styles/colors'
import Header from '../components/header'

injectTapEventPlugin();

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

class App extends Component {
    constructor(props) {
        super(props);
        autobind(this);

        this.state = {
            auth: props.auth.user,
            passwordDialogOpen: false,
            profileDialogOpen: false,
            notifications: []
        }

        this.headerContents = null;
        this.reload = {};
        this.store = {};
    }


    componentWillMount() {
        let auth = this.props.auth;
        auth.onChange(this.onAuthUpdated);
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

    render() {
        let loggedIn = this.props.auth.loggedIn,
            {auth, notifications} = this.state;

        if (loggedIn === undefined || (loggedIn && !auth)) {
            return null;
        }

        let pathname = this.props.location.pathname;

        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div id="wrapper" className="page admin">
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
