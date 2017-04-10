import React from 'react';
import {withRouter} from 'react-router';
import autobind from 'react-autobind';
import Paper from 'material-ui/Paper';
import $ from 'jquery';

class Navigation extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
    }

    onClickNavLink(link) {
        this.props.router.push(`/${link}`);
    }

    setActiveNav(pathName) {
        $('.menu-item').removeClass('active');
        $('.menu-item').each(function() {
            let name = $(this).data('name');
            $(this).addClass('active');
            if (pathName && pathName.indexOf(name) == 1) {
                $(this).addClass('active');
            }
        });
    }

    componentWillReceiveProps(nextProps){
        if (this.props.pathName != nextProps.pathName) {
            this.setActiveNav(nextProps.pathName)
        }
    }

    componentDidMount() {
        this.setActiveNav(this.props.pathName)
    }

    render() {
        return (
            <Paper ref="leftNav" id="left-nav" zDepth={0}>
                <div className='left-nav-content'>
                    <div className="logo">
                        <div className="logo-image"></div>
                    </div>
                    <div id='menu'>
                        <div className='menu-item' data-name='dashboard'>
                            <h4 onClick={this.onClickNavLink.bind(null, '')} >
                                <span className='svg-icon dashboard' />
                                <span>Dashboard</span>
                            </h4>
                        </div>
                        <div className='menu-item' data-name='tags'>
                            <h4 onClick={this.onClickNavLink.bind(null, 'tags')}>
                                <span className='svg-icon tag' />
                                <span>Tags</span>
                            </h4>
                        </div>
                    </div>
                </div>
                <div id="footer">
                    © 2017 James Nguyen.
                </div>
            </Paper>
        )
    }
}

export default withRouter(Navigation);
