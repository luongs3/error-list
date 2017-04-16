import React from 'react';
import {Link} from 'react-router';

class NotFound extends React.Component {
    render() {
        return (
            <div id="not-found">
                <img className="number" src="../../images/svg/404.svg" alt="Page Not Found"/>
                <div className="text">We coundn't find the page you are looking for.</div>
                <Link className='btn' to='/'>BACK TO HOME</Link>
            </div>
        )
    }
}

export default NotFound;
