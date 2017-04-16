import React from 'react';
import autobind from 'react-autobind';
import $ from 'jquery';
import {Mention, MentionsInput} from 'react-mentions'
import defaultStyle from './mentionStyle'

const markup = '@@[__display__]__id__@@';

class CommentInput extends React.Component {
    constructor(props){
        super(props);
        autobind(this);
        this.state = {
            value: '',
            isShowMentionMenu: false
        };
    }

    onChange(ev, value) {
        this.setState({value});
    }

    onSubmit() {
        let value = this.getValue();
        this.resetValue();
        this.props.handleSubmit(value);
    }

    resetValue() {
        let value = '';
        this.setState({value});
    }

    handleRenderSuggestion(suggestion, search, highlightedDisplay) {
        return (
            <div className="user">
                {highlightedDisplay}
            </div>
        );
    }

    toggleMenu() {
        let isShowMentionMenu = this.state.isShowMentionMenu;
        isShowMentionMenu = !isShowMentionMenu;
        this.setState({isShowMentionMenu});
    }

    handleFocusMention() {
        this.setState({isShowMentionMenu: false});
    }

    mentionUser(user) {
        let {value, isShowMentionMenu} = this.state;
        isShowMentionMenu = !isShowMentionMenu;
        this.setState({isShowMentionMenu});
        let userValue = markup.replace('__display__', user.display).replace('__id__', user.id);
        value = `${value}${userValue} `;
        this.setState({value, isShowMentionMenu});
    }

    getValue() {
        return this.state.value.replace(/@@\[[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf-\w- ]+\]/g, '@@');
    }

    renderUserItem(user) {
        let avatar = user.avatar || 'image/default-avatar.gif';
        let backgoundStyle = {
            backgroundImage: `url(${avatar})`
        };
        return(
            <li key={user.id} onClick={this.mentionUser.bind(this, user)} className="user-item">
                <div className="user-avatar" style={backgoundStyle} />
                <div className="user-name">
                    <span>{user.display}</span>
                </div>
            </li>
        )
    }

    render() {
        let {value, isShowMentionMenu} = this.state;
        let items = $.map(this.props.users, (user) => this.renderUserItem(user));

        return (
            <div className="mention-input">
                <div className="control">
                    <div className="users-menu">
                        <span onClick={this.toggleMenu}>
                            <i className="fa fa-user-plus"></i>
                        </span>
                        <ul className="users-list" style={{display: isShowMentionMenu ? 'block' : 'none'}}>
                            {items}
                        </ul>
                    </div>
                    <div className="submit-button" onClick={this.onSubmit}>
                         <span>Send</span>
                    </div>
                </div>
                <div className="input">
                    <MentionsInput
                        value={value}
                        onChange={this.onChange}
                        style={defaultStyle}
                        markup={markup}
                        placeholder={"Mention people using '@'"}
                        onFocus={this.handleFocusMention}
                    >
                        <Mention
                            type="user"
                            trigger="@"
                            data={this.props.users}
                            renderSuggestion={this.handleRenderSuggestion}
                            onAdd={this.onAdd}
                            style={{backgroundColor: '#00BBE5'}}
                        />
                    </MentionsInput>
                </div>
            </div>
        );
    }
}

CommentInput.defaultProps = {
    users: []
};

CommentInput.propTypes = {
    users: React.PropTypes.array,
    handleSubmit: React.PropTypes.func
}

export default CommentInput;
