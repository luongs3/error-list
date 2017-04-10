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
            <div className="tag-list row">
                <div className="col-md-8">
                    <Table fixedHeader={true}>
                        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                            <TableRow>
                                <TableHeaderColumn>Id</TableHeaderColumn>
                                <TableHeaderColumn>Title</TableHeaderColumn>
                                <TableHeaderColumn>Created At</TableHeaderColumn>
                                <TableHeaderColumn>Updated At</TableHeaderColumn>
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
            </div>
        );
    }
}

export default TagList
