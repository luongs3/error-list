import React, {Component} from 'react';
import autobind from 'react-autobind';
import injectTapEventPlugin from 'react-tap-event-plugin';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

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
                <div id="body-content">
                    {this.props.children}
                </div>
            </MuiThemeProvider>
        );
    }
}

export default App;
