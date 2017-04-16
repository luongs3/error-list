import React from 'react';

class Index extends React.Component{
    constructor(props){
        super(props);
    }

    render() {
        let currentPath = this.props.location.pathname;
        let classes = currentPath.replace(/\//g, ' ');
        return (
            <div className={`contents ${classes}`} id="main-content">
                {this.props.children}
            </div>
        );
    }
}

export default Index;
