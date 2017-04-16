import React from 'react'
import TextField from 'material-ui/TextField'
import autoBind from 'react-autobind'
import Popover from 'material-ui/Popover'
import AdvanceSearch from './advance-search';
import _ from 'lodash';

let timer;

class SearchBox extends React.Component {
    constructor(props) {
        super(props);

        let {conditions, advanceConditions} = props;

        this.state = {
            quickSearch: conditions.quickSearch || '',
            order: conditions.order,
            advanceSearchOpen: false,
            advanceConditions
        }

        autoBind(this);
    }

    onChangeQuickSearch(event) {
        let quickSearch = event.target.value;
        this.setState({ quickSearch });

        clearTimeout(timer); // eslint-disable-line
        timer = setTimeout(() => { // eslint-disable-line
            this.updateSearchCondition();
        }, 3000);
    }

    handleTouchTap(event) {
        this.setState({
            advanceSearchOpen: true,
            anchorEl: event.currentTarget
        });
    }

    handleRequestClose() {
        this.setState({advanceSearchOpen: false});
    }

    handleAdvanceSearchCancel() {
        let advanceConditions = {
            courseClass: '',
            teacher: '',
            startedAt: null,
            endedAt: null,
            startedDate: null,
            endedDate: null,
            isActive: false
        };
        this.setState({advanceSearchOpen: false, advanceConditions});
    }

    componentWillReceiveProps(nextProps) {
        let quickSearch = nextProps.conditions.quickSearch || '';
        let advanceConditions = nextProps.advanceConditions;
        if (!_.isEqual(advanceConditions, this.state.advanceConditions)) {
            this.setState({advanceConditions});
        }

        this.setState({ quickSearch });
    }

    onSearchBoxKeyDown(event) {
        if (event.keyCode == 13) {
            clearTimeout(timer);
            this.updateSearchCondition();
        }
    }

    onAdvanceSearch(advanceConditions) {
        this.setState({advanceConditions, quickSearch: ''});
        this.props.onAdvanceSearch(advanceConditions);
    }

    updateSearchCondition() {
        let advanceConditions = {};
        this.setState({advanceConditions});
        let conditions = this.props.conditions;
        conditions.quickSearch = this.state.quickSearch;
        if (this.props.search) {
            this.props.search(conditions);
        }
    }

    render() {
        let advanceConditions = this.state.advanceConditions;
        return (
            <div className='search-box'>
                <div className='search-input'>
                    <i className="material-icons icon-search">search</i>
                    <TextField
                        fullWidth={true}
                        className='search'
                        ref='quick-search'
                        id='quick-search'
                        value={this.state.quickSearch}
                        onChange={this.onChangeQuickSearch}
                        style={{height: '36px', padding: '0 10px', lineHeight: '36px'}}
                        underlineShow={false}
                        placeholder={this.props.placeholder}
                        hintStyle={{bottom: 0}}
                        onKeyDown={this.onSearchBoxKeyDown}
                    />
                    {this.props.advanceSearchable ?
                        (<span className="advance-search-box">
                            <i className="material-icons advance-search-icon" onTouchTap={this.handleTouchTap}>arrow_drop_down</i>
                            <Popover
                                className="popover-advance-search"
                                open={this.state.advanceSearchOpen}
                                anchorEl={this.state.anchorEl}
                                anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                                onRequestClose={this.handleRequestClose}
                                >
                                <AdvanceSearch
                                    onAdvanceSearch={this.onAdvanceSearch}
                                    onRequestClose={this.handleRequestClose}
                                    advanceConditions={advanceConditions}
                                    onAdvanceSearchCancel={this.handleAdvanceSearchCancel}
                                />
                            </Popover>
                        </span>)
                    : null}
                </div>
            </div>
        );
    }
}

SearchBox.propTypes = {
    conditions: React.PropTypes.object,
    search: React.PropTypes.func,
    onAdvanceSearch: React.PropTypes.func,
    advanceConditions: React.PropTypes.object
}

SearchBox.defaultProps = {
    conditions: {
        quickSearch: '',
        order: 'name'
    },
    advanceSearchable: false,
    advanceConditions: {},
    placeholder: 'Search'
}


export default SearchBox;
