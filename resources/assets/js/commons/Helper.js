import $ from 'jquery';
import _ from 'lodash';
import moment from 'moment';
import Config from '../config';

const universities = Config.universities;
const grades = Config.dashboardGrades;

export default {
    getErrorMessages(errors) {
        let normalized = {};
        for (let name in errors) {
            let messages = errors[name];
            if (Array.isArray(messages) && messages[0]) {
                normalized[name] = messages[0];
            } else if (typeof messages === 'string' || messages) {
                normalized[name] = messages
            } else {
                normalized[name] = 'Error';
            }
        }
    },
    capitalise(string) {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    },
    applyParams(string, params) {
        let temp;
        for (let param in params) {
            temp = string.replace(`\$\{${param}\}`, params[param]);
        }

        return temp
    },
    showSplashScreen() {
        $('.splash-screen').show();
    },
    hideSplashScreen() {
        $('.splash-screen').fadeOut();
    },
    validateEmail(email) {
        let validateEmail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        email = email.trim();
        return validateEmail.test(email);
    },
    errorsToArray(errors) {
        if (typeof errors == 'string') {
            return [errors];
        } else if (typeof errors == 'object') {
            let errorString = [];
            for (let key in errors) {
                errorString = errorString.concat(this.errorsToArray(errors[key]));
            }
            return errorString;
        }
    },
    getFirstError(xhr) {
        let errorsArray = [];
        if (xhr.responseJSON) {
            errorsArray = this.errorsToArray(xhr.responseJSON);
        }

        if (errorsArray[0] && errorsArray[0] !== '') {
            return errorsArray[0];
        }

        return 'A server error occurred. Please contact the administrator';
    },
    getUniversity(id) {
        let universities = Config.universities;
        id = parseInt(id);
        let university = _.find(universities, {id});
        if (university) {
            return university.name;
        }

        return '-';
    },
    getGrade(id) {
        let grades = Config.grades;
        id = parseInt(id);
        let grade = _.find(grades, {id});
        if (grade) {
            return grade.name;
        }

        return '-';
    },
    getUserName(user) {
        if (!user) {
            return '';
        }

        let name = `${user.first_name || ''} ${user.last_name || ''}`
        return name.trim() || user.email;
    },
    nl2br(str) {
        return str.replace(/\r\n|\n|\r/g, '<br />');
    },
    nl2dm(str) {
        return str.replace(/\r\n|\n|\r/g, '; ');
    },
    maxWeekOf(month) {
        let start = moment(month).startOf('month');
        // Number of days in month
        let dayInMonth = start.daysInMonth();
        //start.day() return index of day (Sunday = 0, Monday = 1, ..., Staturday = 6)
        let additionDays = 6 - start.day();

        return Math.ceil((dayInMonth + additionDays) / 7);
    },

    calculateAverage(evaluation) {
        let evaluations = Config.evaluation,
            criterias = Object.keys(evaluations);

        let total = 0,
            max = 0;

        $.map(evaluation, (value, key) => {
            if (criterias.indexOf(key) != -1) {
                total += value * evaluations[key];
                max += evaluations[key];
            }
        });

        return Math.floor((total / max) * 10) / 10;
    },
    processDateBeforeSend(data, dateNamesArray = []) {
        dateNamesArray.map(dateName => {
            data[dateName] = moment(data[dateName]).format('YYYY-MM-DD hh:mm:ss');
        });
    },
    getContract(teacher) {
        return teacher.full_time ? 'Full Time' : 'Part Time';
    },
    getJobTypeFromValue(jobType) {
        if (typeof jobType == 'boolean') {
            const contracts = Config.contracts;
            if (jobType == true) {
                return contracts[1];
            }

            return contracts[0];
        }

        return jobType;
    },
    setGradeIfSelectFramgiaUniversity(university, grade) {
        const universityFramgia = _.find(universities, {name: 'FRAMGIA'});
        const gradeAll = _.find(grades, {name: 'All'});

        if (university.name == universityFramgia['name']) {
            grade = gradeAll;
        }

        return grade;
    }
};
