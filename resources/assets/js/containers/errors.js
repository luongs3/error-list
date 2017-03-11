import React, {Component} from 'react';
import autobind from 'react-autobind';

class Errors extends Component {
    constructor(props) {
        super(props);
        autobind(this);

        this.state = {videos: []};
    }

    render() {
        return (
            <div>
                Error List
            </div>
        );
    }
}

export default Errors;
