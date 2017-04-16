import React from 'react';

class PaginationLinks extends React.Component{
    constructor(props){
        super(props);
    }

    goToPage(page) {
        if (this.props.goToPage) {
            this.props.goToPage(page);
        }
    }

    arrow(className, page, enabled) {
        return (
            <div className={`link arrow${!enabled ? ' disabled' : ''}`}
                onClick={enabled ? this.goToPage.bind(this, page) : undefined}
            >
                <i className="material-icons">{className}</i>
            </div>
        )
    }

    render(){
        let currentPage = this.props.currentPage,
            pageCount = this.props.pageCount,
            pagesToDisplay = this.props.pagesToDisplay;

        let firstPage = 1,
            lastPage = pageCount < pagesToDisplay ? pageCount : pagesToDisplay;

        let firstShiftPlace = Math.ceil(this.props.pagesToDisplay / 2);
        if (pageCount > pagesToDisplay && currentPage > firstShiftPlace) {
            let shiftDistance = currentPage - firstShiftPlace,
                shiftOverMatch = lastPage + shiftDistance > pageCount ? lastPage + shiftDistance - pageCount : 0;
            firstPage += shiftDistance - shiftOverMatch;
            lastPage += shiftDistance - shiftOverMatch;
        }

        let showFirst = currentPage > 1,
            showLast= currentPage < pageCount;

        let showPrev = currentPage > 1,
            showNext = currentPage < pageCount;

        let links = [];
        for (let i = firstPage; i <= lastPage; i++) {
            links.push(
                <div key={i} className={`link${i == currentPage ? ' current' : ''}`}
                    onClick={this.goToPage.bind(this, i)}
                >
                    <span>{i}</span>
                </div>
            );
        }

        return (
            <div id="pagination">
                <div className="total">
                    {this.props.current} / {this.props.total} items
                </div>
                <div className="pagination-links" >
                    {this.arrow('first_page', 1, showFirst)}
                    {this.arrow('navigate_before', currentPage - 1, showPrev)}
                    {links}
                    {this.arrow('navigate_next', currentPage + 1, showNext)}
                    {this.arrow('last_page', pageCount, showLast)}
                </div>
            </div>
        )
    }
}

PaginationLinks.propTypes = {
    currentPage: React.PropTypes.number.isRequired,
    pageCount: React.PropTypes.number.isRequired,
    goToPage: React.PropTypes.func.isRequired,
    current: React.PropTypes.number.isRequired,
    total: React.PropTypes.number.isRequired,
    pagesToDisplay: React.PropTypes.number
}

PaginationLinks.defaultProps = {
    pagesToDisplay: 5,
    current: 0,
    total: 0
}

export default PaginationLinks;
