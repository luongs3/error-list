import React from 'react';
import {Link} from 'react-router';

class Breadcrumb extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let items = this.props.items || [];

        if (items.length == 0) {
            return null;
        }

        let breadcrumbs = [],
            path = '';

        items.map((item, index) => {
            if (breadcrumbs.length < (items.length * 2 - 2)) {
                path = `${path}/${item.path}`;
                breadcrumbs.push(
                    <Link key={index} to={path}>{item.name}</Link>
                );
                breadcrumbs.push(<i key={`icon-${breadcrumbs.length}`} className="material-icons">chevron_right</i>);
            } else {
                breadcrumbs.push(
                    <span key={index}>{item.name}</span>
                );
            }
        });

        return (
            <div id="breadcrumbs" className={this.props.className}>
                {breadcrumbs}
            </div>
        );
    }
}

Breadcrumb.propTypes = {
    items: React.PropTypes.array.isRequired
}

export default Breadcrumb;
