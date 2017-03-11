import React, {Component} from 'react';
import autobind from 'react-autobind';
import $ from 'jquery';
import _ from 'lodash';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

class TagList extends Component {
    constructor(props) {
        super(props);
        autobind(this);

        this.state = {};
    }

    render() {
        return (
            <div className="tag-list">
                <Table fixedHeader={true}>
                    <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                        <TableRow>
                        </TableRow>
                    </TableHeader>
                    <TableBody
                        displayRowCheckbox={false}
                        showRowHover={true}
                        stripedRows={true}
                    >

                    </TableBody>
                </Table>
            </div>
        );
    }
}

export default TagList
