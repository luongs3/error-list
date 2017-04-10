import React, {Component} from 'react';
import TagList from '../components/tag/tag-list';

class Tag extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="tag-container">
                <TagList />
            </div>
        );
    }
}

export default Tag;
