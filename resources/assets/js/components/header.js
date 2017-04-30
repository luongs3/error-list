import React from 'react';
import {withRouter} from 'react-router';
import autobind from 'react-autobind';
import AppBar from 'material-ui/AppBar';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import $ from 'jquery';
import Notification from './notification'

class Header extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            menuOpen: false
        }

        autobind(this);
    }

    toggleMenu() {
        this.setState({menuOpen: !this.state.menuOpen});
    }

    closeMenu() {
        this.setState({menuOpen: false});
    }

    goTo(pathname) {
        this.closeMenu();
        this.props.router.push({
            pathname,
            state: {
                prev: this.props.pathname
            }
        });
    }

    setActive(pathname) {
        return this.props.pathname.indexOf(pathname) === 0 ? 'active' : '';
    }

    gotoProfile() {
        let user = this.props.auth;
        this.props.router.push(`admins/${user.id}/edit`);
    }

    toggleNav() {
        $('#wrapper').toggleClass('close-nav');
    }

    render() {
        return (
            <AppBar id="header" className="header" iconElementLeft={<div/>}>
                <div className="header-contents">
                    <i className="material-icons toggle-nav" onClick={this.toggleNav}>menu</i>
                    <div className="left-header">
                        {this.props.children}
                    </div>
                    <div className="header-menu" ref="userMenu">
                        <div className='button' onClick={this.toggleMenu.bind(this)}>
                            <div className="header-avatar img-circle" style={{backgroundImage: `url('${this.props.auth.avatar}')`}} />
                            <i className="material-icons header-icon">arrow_drop_down</i>
                        </div>
                    </div>
                </div>
                <Popover
                    open={this.state.menuOpen}
                    anchorEl={this.refs.userMenu}
                    anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                    targetOrigin={{horizontal: 'right', vertical: 'top'}}
                    onRequestClose={this.closeMenu.bind(this)}
                >
                    <Menu>
                        <MenuItem
                            primaryText={'Update profile'}
                            innerDivStyle={{paddingLeft:'50px'}}
                            style={{cursor:'pointer'}}
                            leftIcon={<i className="fa fa-key" style={{margin: '14px'}} aria-hidden="true"/>}
                            onClick={this.gotoProfile}
                        />
                        <MenuItem
                            primaryText={'Log out'}
                            innerDivStyle={{paddingLeft: '50px'}}
                            href='logout'
                            leftIcon={<i className="fa fa-sign-out" style={{margin: '14px'}} aria-hidden="true"/>}
                        />
                    </Menu>
                </Popover>
            </AppBar>
        );
    }
}

Header.propTypes = {
    auth: React.PropTypes.object,
    pathname: React.PropTypes.string,
    togglePasswordDialog: React.PropTypes.func
};

Header.contextTypes = {
    app: React.PropTypes.object
}

export default withRouter(Header);
