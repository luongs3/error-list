import React from 'react';
import autobind from 'react-autobind';
import Config from '../../config';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import DropdownList from 'react-widgets/lib/DropdownList';
import moment from 'moment';
import LessonPopup from './lesson-popup';
import _ from 'lodash';

let filteredUniversities = [];
const universities = Config.universities;
const COLUMN_QUANTITY_EXCEPT_GRADES_COLUMN = 11;
const COLUMN_WIDTH = 80;
const WIDTH_OF_TWO_LEFT_COLUMN = 160;

class MonthlyReport extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);

        this.state = {
            month: this.getEndOfThisMonth(moment()),
            university: null,
            reports: props.reports,
            lessonIds: [],
            selectedGrade: null,
            open: false,
            tableWidth: 1500,
            tableLeft: 0,
            errorText: '',
            lowestWorkingMonth: null
        };
    }

    componentWillMount() {
        this.setLowestWorkingMonth();
        this.filterUniversityOfTeacher();
        this.initUniversity();
    }

    setLowestWorkingMonth() {
        const {reports} = this.state;

        if (reports && reports[0]) {
            let lowestWorkingMonth = moment(reports[reports.length-1].date, 'YYYY-MM-DD hh:mm::ss').format('YYYY-MM-DD');
            this.setState({lowestWorkingMonth});
        }
    }

    filterUniversityOfTeacher() {
        const {reports} = this.state;
        if (reports && reports.length) {
            let differenceUniversityReports = _.uniqBy(reports, 'university_id');
            let filteredUniversityIdArray = _.map(differenceUniversityReports, 'university_id');
            this.setFilteredUniversities(filteredUniversityIdArray);
        }
    }

    setFilteredUniversities(filteredUniversityIdArray) {
        filteredUniversityIdArray.map(
            value => filteredUniversities.push(
                ...universities.filter(university => {
                    if(university.id == value) {
                        return university;
                    }
                })
            )
        );
    }

    initUniversity() {
        if (filteredUniversities.length) {
            this.setState({university: filteredUniversities[0]})
        }
    }

    componentDidMount() {
        let tableWidth = (Config.grades.length * 2 + COLUMN_QUANTITY_EXCEPT_GRADES_COLUMN) * COLUMN_WIDTH
        - WIDTH_OF_TWO_LEFT_COLUMN;
        this.updateTableWidth(tableWidth);
        // window.addEventListener('resize', this.changeTableLeft.bind(this, tableWidth));
        document.getElementsByClassName('profile-containter')[0].addEventListener('scroll', this.updateTableDimensions);
    }

    updateTableWidth(tableWidth) {
        this.setState({tableWidth});
        this.changeTableLeft (tableWidth);
    }

    updateTableDimensions() {
        let scrollLeft = 0;
        // let tableWidth = this.state.tableWidth;
        const profileContainerNode = document.querySelector('.profile-containter');

        if(!profileContainerNode){
            return false;
        }

        scrollLeft = profileContainerNode.scrollLeft;
        this.setLeftStaticCol(scrollLeft);
        // this.changeTableLeft(tableWidth);
        this.setTopStaticRow();
    }

    setLeftStaticCol(left) {
        let tableLeft = this.state.tableLeft;
        // let header = document.getElementsByClassName('monthly-report-header')[0];
        let staticCol1 = document.getElementsByClassName('col-static-1');
        let staticCol2 = document.getElementsByClassName('col-static-2');
        let monthlyReportHeader = document.getElementsByClassName('monthly-report-header');
        // header.style.left = `${left - tableLeft}px`;
        if (left < (16 + tableLeft)) {
            left = 16 + tableLeft;
        }
        this.changeLeft(staticCol1, left - 176 - tableLeft);
        this.changeLeft(staticCol2, left - 96 - tableLeft);
        this.changeLeft(monthlyReportHeader, left - 16 - tableLeft);
    }

    setTopStaticRow() {
        let scrollTop = document.getElementsByClassName('profile-containter')[0].scrollTop;
        if (scrollTop < 250) {
            scrollTop = 250;
        }

        document.getElementsByClassName('table-header')[0].style.top = `${scrollTop - 250}px`;
    }

    changeLeft(columns, left) {
        for (let i = 0, len = columns.length; i < len; i++) {
            columns[i].style.left = `${left}px`;
        }
    }

    changeTableLeft(tableWidth) {
        let reportTable = document.getElementById('report-table');
        let tableLeft = (window.innerWidth - 340 - tableWidth)/2;
        if (tableLeft < 0) {
            tableLeft = 0;
        }

        if (!reportTable) {
            return false;
        }

        document.getElementById('report-table').style.left = tableLeft;
        this.setState({tableLeft});
    }

    componentWillUnmount() {
        document.getElementsByClassName('profile-containter')[0].removeEventListener('scroll', this.updateTableDimensions);
    }

    onMonthChange(name, month) {
        let newMonth = moment(month).startOf('day');

        if (newMonth.isAfter(moment().startOf('day'))) {
            this.setState({
                errorText: 'Have no data yet!'
            });
        } else {
            const adjustedMonth = this.getEndOfThisMonth(month);
            this.setState({
                month: adjustedMonth,
                errorText: ''
            });
        }
    }

    getEndOfThisMonth(month) {
        return moment(month).date(25);
    }

    getStartOfPreviousMonth(month) {
        return moment(month).subtract(1, 'month').date(26);
    }

    onUniversityChange(name, university) {
        this.setState({university});
    }

    specialDayOrNot(dateCount) {
        let dayInWeek = this.getDayIdFromDate(dateCount.day());
        let specialDay = 'normal';

        if (dayInWeek == 'Sun' || dayInWeek == 'Sat') {
            specialDay = 'not-working-day'
        }

        return specialDay
    }

    calculateTotal(reports) {
        const total = {
            lesson: 0,
            time: 0,
            workingDays: 0
        };

        reports.map(report => {
            total.lesson += report.total.lesson;
            total.time += report.total.time;
            total.workingDays = this.increaseWorkingDays(total.workingDays, report);
        })

        return total;
    }

    increaseWorkingDays(workingDays, report) {
        if (report.total_time) {
            workingDays += 1
        }

        return workingDays;
    }

    getMonthInformation(month) {
        const startOfMonth = this.getStartOfPreviousMonth(month);
        const daysInMonth = moment(month).diff(startOfMonth, 'days');
        const dateCount = moment(startOfMonth).subtract(1, 'days');

        return {startOfMonth, daysInMonth, dateCount};
    }

    renderReports(reports, month) {
        let {daysInMonth, dateCount} = this.getMonthInformation(month),
            reportElements = [],
            reportCount = reports.length - 1;

        for (let i = 0; i <= daysInMonth; i++) {
            let value = this.getDefaultReport();
            dateCount = dateCount.add(1, 'days');
            let specialDay = this.specialDayOrNot(dateCount);
            let isValuable = false;

            if (dateCount.diff(moment(), 'days') > -1) {
                reportElements[i] = this.renderEmptyContent(dateCount, specialDay, i);
                break;
            }

            for (let j = reportCount; j > -1; j--) {
                if (dateCount.date() == moment(reports[j].date, 'YYYY-MM-DD hh:mm::ss').date()) {
                    reportCount--;
                    value = reports[j];
                    isValuable = true;
                    break;
                }
            }

            reportElements[i] =  (
                <tr className={specialDay} key={i}>
                    <td className="col-static-1">{dateCount.format('MM/DD')}</td>
                    <td className="col-static-2">{this.getDayIdFromDate(dateCount.day())}</td>
                    {this.renderGradesContent(value)}
                    <td className={`lesson-and-time ${isValuable ? 'valuable' : ''}`}>{value.official.lesson}</td>
                    <td className={`lesson-and-time ${isValuable ? 'valuable' : ''}`}>{value.official.time}</td>
                    <td className={`lesson-and-time ${isValuable ? 'valuable' : ''}`}>{value.non_official.lesson}</td>
                    <td className={`lesson-and-time ${isValuable ? 'valuable' : ''}`}>{value.non_official.time}</td>
                    <td className={`lesson-and-time ${isValuable ? 'valuable' : ''}`}>{value.total.lesson}</td>
                    <td className={`lesson-and-time ${isValuable ? 'valuable' : ''}`}>{value.total.time}</td>
                    <td className={`lesson-and-time ${isValuable ? 'valuable' : ''}`}>
                        {value.time_in ? moment(value.time_in).format('hh:mm') : 0}
                    </td>
                    <td className={`lesson-and-time ${isValuable ? 'valuable' : ''}`}>
                        {value.time_out ? moment(value.time_out).format('hh:mm') : 0}
                    </td>
                    <td className={`lesson-and-time ${isValuable ? 'valuable' : ''}`}>{value.total_time}</td>
                </tr>
            )
        }

        return reportElements;
    }

    renderEmptyContent(dateCount, specialDay, i) {
        return (
            <tr className={specialDay} key={i}>
                <td className="col-static-1">{dateCount.format('MM/DD')}</td>
                <td className="col-static-2">{this.getDayIdFromDate(dateCount.day())}</td>
                {this.renderEmptyGradeContent()}
                <td><div className="min-height"></div></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        )
    }

    renderEmptyGradeContent() {
        const grades = Array.from(Config.grades);
        return grades.map(() =>
            ([
                <td className="lesson-and-time" key="lesson">
                </td>,
                <td className="lesson-and-time" key="time">
                </td>
            ])
        );
    }

    /* eslint-disable */
    getDefaultReport() {
        return {
            lesson_ids: [],
            grades: {},
            total: {
                lesson: 0,
                time: 0
            },
            official: {
                lesson: 0,
                time: 0
            },
            non_official: {
                lesson: 0,
                time: 0
            },
            time_in: 0,
            time_out: 0,
            total_time: 0
        };
    }
    /* eslint-enable */

    renderGradesContent(report) {
        const reportGrades = report.grades;
        const grades = Array.from(Config.grades);
        return grades.map((grade) => {
            let lesson = 0;
            let time = 0;
            let gradeData = {};
            Object.assign(gradeData, grade);

            if (reportGrades.length > 0) {
                for (const reportGrade of reportGrades) {
                    if (grade.id === reportGrade.id) {
                        lesson = reportGrade.lesson;
                        time = reportGrade.time;
                        Object.assign(gradeData, reportGrade);
                    }
                }
            }

            if (time === 0) {
                return ([
                    <td className="lesson-and-time" key="lesson-{index}">
                        {lesson}
                    </td>,
                    <td className="lesson-and-time" key="time-{index}">
                        {time}
                    </td>
                ]);
            }

            return ([
                <td
                    className="lesson-and-time clickable valuable"
                    key="lesson-{index}"
                    onClick={() => this.showLessonDetail(gradeData)}
                >
                    {lesson}
                </td>,
                <td
                    className="lesson-and-time clickable valuable"
                    key="time-{index}"
                    onClick={() => this.showLessonDetail(gradeData)}
                >
                    {time}
                </td>
            ]);
        });
    }

    renderHeaderLv1() {
        const grades = Array.from(Config.grades);
        const gradeElements = grades.map((value, index) => <th key={index} colSpan="2">{value.name}</th>);

        return (
            <tr className="header-level-1">
                <th colSpan="2" className="col-static-1 fix-header" style={{backgroundColor: 'aliceblue'}}></th>
                {gradeElements}
                <th colSpan="2" className="strong-text">Official</th>
                <th colSpan="2" className="strong-text">Non-official</th>
                <th colSpan="2" className="strong-text">Total</th>
                <th colSpan="3" className="strong-text">Timesheet</th>
            </tr>
        );
    }

    renderHeaderLv2() {
        const grades = Config.grades;
        const lessonAndTimeElements = grades.map(() => ([
            <th className="header-lesson-and-time" key="lesson-{index}">Lesson</th>,
            <th className="header-lesson-and-time" key="time-{index}">Time</th>
        ]));

        return (
            <tr className="header-level-2">
                <th className="col-static-1" style={{backgroundColor: 'aliceblue'}}>Date</th>
                <th className="col-static-2" style={{backgroundColor: 'aliceblue'}}>Day</th>
                {lessonAndTimeElements}
                <th className="header-lesson-and-time">Lesson</th>
                <th className="header-lesson-and-time">Time</th>
                <th className="header-lesson-and-time">Lesson</th>
                <th className="header-lesson-and-time">Time</th>
                <th className="header-lesson-and-time">Lesson</th>
                <th className="header-lesson-and-time">Time</th>
                <th className="header-lesson-and-time">Time In</th>
                <th className="header-lesson-and-time">Time Out</th>
                <th className="header-lesson-and-time">Total Time</th>
            </tr>
        );
    }

    handleOpen() {
        this.setState({open: true});
    }

    handleClose() {
        this.setState({open: false});
    }

    showLessonDetail(selectedGrade) {
        this.setState({selectedGrade});
        this.handleOpen();
    }

    getDayIdFromDate(dayIndex) {
        const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        return (dayIndex > -1 && dayIndex < 7) ? weekday[dayIndex] : null;
    }

    getLowestWorkingMonth() {
        const {reports} = this.props;

        if (reports && reports[0]) {
            let lowestWorkingMonth = moment(reports[0].date, 'YYYY-MM-DD hh:mm::ss').format('YYYY-MM-DD');
            this.setState({lowestWorkingMonth});
        }
    }

    getReportsOfCurrentMonth(reports, month, university) {
        return reports.filter(value => {
            const reportDate = moment(value.date, 'YYYY-MM-DD hh:mm:ss').format('MM YYYY');

            if (reportDate === moment(month).format('MM YYYY') &&
                value.university_id === university.id
            ) {
                return true;
            }

            return false;
        });
    }

    render() {
        const {month, university, tableWidth, tableLeft, reports, lowestWorkingMonth} = this.state,
            {teacher} = this.props;

        if(!reports) {
            return (<div className="monthly-report" id="report"></div>);
        }

        const filterdReports = this.getReportsOfCurrentMonth(reports, month, university),
            reportElements = this.renderReports(filterdReports, month),
            total = this.calculateTotal(filterdReports, month);

        return (
            <div className="monthly-report" id="report">
                <div className="monthly-report-header">
                    <div className="report-lesson-popup">
                        <LessonPopup
                            open={this.state.open}
                            onClose={this.handleClose}
                            lessonIds={this.state.lessonIds}
                            selectedGrade={this.state.selectedGrade}
                        />
                    </div>
                    <div className={`monthly-report-filter ${this.state.errorText ? '' : 'no-error'}`}>
                        <DateTimePicker
                            value={new Date(month)}
                            initialView="year"
                            time={false}
                            format="MMM YYYY"
                            min={new Date(lowestWorkingMonth)}
                            max={new Date()}
                            onChange={this.onMonthChange.bind(this, 'month')}
                            placeholder="Mar 2017"
                            className="month-filter"
                        />
                        <DropdownList
                            className="university-filter"
                            data={filteredUniversities}
                            valueField='id'
                            textField='name'
                            value={university}
                            onChange={this.onUniversityChange.bind(this, 'university')}
                        />
                    </div>
                    {this.state.errorText ?
                        <div className="error">
                            <span>{this.state.errorText}</span>
                        </div> : ''
                    }
                    <div className="timesheet-total" style={{paddingLeft: '20px'}}>
                        <h2>TIMESHEET {moment().year()}</h2>
                            <div className="teacher-infor">
                                <div className="teacher-name">
                                    <span className="name-title">Name: </span>
                                    <h2>{Helper.getUserName(teacher)}</h2>
                                </div><br/>
                                <div className="teacher-contract">
                                    <span className="name-title" style={{marginRight: '10px'}}>Contract: </span>
                                    {Helper.getContract(teacher)}
                                </div>
                            </div>
                        <div className="timesheet-total-info">
                            <h3>Total</h3>
                            <div className="total-info-working">Working Days: <span className="result">{total.workingDays}</span></div>
                            <div className="total-info-lesson">Lesson: <span className="result">{total.lesson}</span></div>
                            <div className="total-info-time">Check time: <span className="result">{total.time}</span></div>
                        </div>
                    </div>
                </div>
                <table
                    id="report-table"
                    style={{width: tableWidth, left: tableLeft}}
                    className="monthly-report-data table table-bordered"
                >
                    <thead className="table-header" style={{width: tableWidth}}>
                        {this.renderHeaderLv1()}
                        {this.renderHeaderLv2()}
                    </thead>
                    <tbody className="table-body table-content" style={{width: tableWidth}}>
                        {reportElements}
                    </tbody>
                </table>
            </div>
        );
    }
}

MonthlyReport.propTypes = {
    reports: React.PropTypes.array
}

export default MonthlyReport;
