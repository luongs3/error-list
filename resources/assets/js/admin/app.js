import React, {Component} from 'react';
import autobind from 'react-autobind';
import injectTapEventPlugin from 'react-tap-event-plugin';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Navigation from './components/navigation';

class App extends Component {
    constructor(props) {
        super(props);
        autobind(this);
    }

    componentWillMount() {
        injectTapEventPlugin();
    }

    render() {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                <div className="body-content row">
                    <div className="left-nav col-md-2 nopadding">
                        <Navigation />
                    </div>
                    <div className="content col-md-10 nopadding">{this.props.children}</div>
                </div>
            </MuiThemeProvider>
        );
    }
}

export default App;
