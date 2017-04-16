import React from 'react';
import autobind from 'react-autobind';
import Config from '../../config';
import $ from 'jquery';
import _ from 'lodash';
import {TextField} from 'material-ui';

const criteriaIndexs = Config.criteriasIndex;
const criterias = Config.criterias;

class EvaluateForm extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);

        this.state = {
            lesson: props.lesson,
            total: 0
        }
    }

    componentWillReceiveProps(nextProps) {
        this.resetForm();
        this.setState({lesson: nextProps.lesson});
    }

    handleSaveToDraft() {
        this.props.onSaveToDraft($('#evaluate-form').serialize());
    }

    resetForm() {
        let formElement = $('#evaluate-form');
        if (formElement.length > 0) {
            formElement[0].reset();
        }
        this.setState({total: 0});
    }

    handleReport() {

    }

    calculateTotal() {
        let total = $('.radio-good:checked').length;
        this.setState({total});
    }

    renderCriteriasGroup(criteriaIndex) {
        let criteriaElements = [];
        let criteriasInGroup = _.filter(criterias, (criteria) => criteria.groupId === criteriaIndex.id);
        let indexName = (
            <td rowSpan={criteriasInGroup.length}>
                <span>{criteriaIndex.name}</span>
            </td>
        );
        let i = 0;
        criteriaElements.push(
            <tr key={`${criteriaIndex.id}_${criteriasInGroup[i].id}`}>
                {indexName}
                <td className="criteria-name">
                    <span>{criteriasInGroup[i].name}</span>
                </td>
                <td className="radio">
                    <div className="radio-check">
                        <input className="radio-good"
                            name={`criteria_${criteriasInGroup[i].id}`}
                            type="radio"
                            value={1}
                            onClick={this.calculateTotal}
                        />
                        <label htmlFor={`radio-criteria-${criteriasInGroup[i].id}-good`} className="criteria-good-label" />
                    </div>
                </td>
                <td className="radio">
                    <div className="radio-check">
                        <input className="radio-bad"
                            name={`criteria_${criteriasInGroup[i].id}`}
                            type="radio"
                            value={0}
                            onClick={this.calculateTotal}
                        />
                        <label htmlFor={`radio-criteria-${criteriasInGroup[i].id}-bad`} className="criteria-bad-label" />
                    </div>
                </td>
            </tr>
        );

        for (i = 1; i < criteriasInGroup.length; i++) {
            criteriaElements.push(
                <tr key={`${criteriaIndex.id}_${criteriasInGroup[i].id}`}>
                    <td className="criteria-name">
                        <span>{criteriasInGroup[i].name}</span>
                    </td>
                    <td className="radio">
                        <div className="radio-check">
                            <input className="radio-good"
                                name={`criteria_${criteriasInGroup[i].id}`}
                                id={`radio-criteria-${criteriasInGroup[i].id}-good`}
                                type="radio"
                                value={1}
                                onClick={this.calculateTotal}
                            />
                            <label htmlFor={`radio-criteria-${criteriasInGroup[i].id}-good`} className="criteria-good-label" />
                        </div>
                    </td>
                    <td className="radio">
                        <div className="radio-check">
                            <input className="radio-bad"
                                name={`criteria_${criteriasInGroup[i].id}`}
                                id={`radio-criteria-${criteriasInGroup[i].id}-bad`}
                                type="radio"
                                value={0}
                                onClick={this.calculateTotal}
                            />
                            <label htmlFor={`radio-criteria-${criteriasInGroup[i].id}-bad`} className="criteria-bad-label" />
                        </div>
                    </td>
                </tr>
            );
        }

        return criteriaElements;
    }

    render() {
        let {lesson, total} = this.state;

        if (lesson === null) {
            return null;
        }

        let criteriaElements = $.map(criteriaIndexs, (criteriaIndex) => this.renderCriteriasGroup(criteriaIndex))

        return (
            <div className="evaluate-form">
                <form id="evaluate-form">
                    <input type="hidden" value={lesson.id} name="lesson_id" />
                    <table className="criteria-table">
                        <thead>
                            <tr>
                                <th><span>Index</span></th>
                                <th><span>Content</span></th>
                                <th className="title-good"><span>Good</span></th>
                                <th className="title-bad"><span>Bad</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {criteriaElements}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="2" className="total"><span>Total</span></td>
                                <td colSpan="2" className="total-value"><span>{`${total}/${criterias.length}`}</span></td>
                            </tr>
                        </tfoot>
                    </table>

                    <div className="comment">
                        <label>Comment</label>
                        <TextField
                            id='comment-field'
                            ref='comment-field'
                            className="input-border comment-field"
                            underlineShow={false}
                            fullWidth={true}
                            multiLine={true}
                            rows={3}
                            name="content"
                            placeholder="Enter comment"
                        />
                    </div>
                </form>
                <div className="action-button">
                    <div className="save-button" onClick={this.handleSaveToDraft}>
                        <span>SAVE TO DRAFT</span>
                    </div>
                    <div className="report-button" onClick={this.handleReport}>
                        <span>REPORT</span>
                    </div>
                </div>
            </div>
        );
    }
}

EvaluateForm.propTypes = {
    lesson: React.PropTypes.object,
    onEvaluateLesson: React.PropTypes.func,
    onSaveToDraft: React.PropTypes.func
}

EvaluateForm.defaultProps = {
    lesson: null
}

export default EvaluateForm;
