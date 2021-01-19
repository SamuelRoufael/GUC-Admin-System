function getStartEndDates() {
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    let startDay = 11;
    let startMonth;
    let startYear;
    let endDay = 10;
    let endMonth;
    let endYear;
    if (currentDay >= 11) {
        startMonth = currentMonth
        startYear = currentYear
        if (startMonth == 11) {
            endMonth = 0
            endYear = currentYear + 1
        }
        else {
            endMonth = currentMonth + 1
            endYear = currentYear
        }
    }
    else {
        endYear = currentYear
        endMonth = currentMonth
        if (endMonth == 0) {
            startMonth = 11
            startYear = currentYear - 1
        }
        else {
            startMonth = currentMonth - 1
            startYear = currentYear
        }
    }
    return {
        startDate: new Date(startYear, startMonth, startDay, 2, 0, 0),
        endDate: new Date(endYear, endMonth, endDay, 2, 0, 0)
    }
}

// return 1 -> date_One > date_Two , 0 -> date_One = date_Two, -1 -> date_One < date_Two
function compareDates(date_One, date_Two) {
    if (date_One.getFullYear() > date_Two.getFullYear())
        return 1;
    else if (date_One.getFullYear() < date_Two.getFullYear())
        return -1;
    else {
        if (date_One.getMonth() > date_Two.getMonth())
            return 1;
        else if (date_One.getMonth() < date_Two.getMonth())
            return -1;
        else {
            if (date_One.getDate() > date_Two.getDate())
                return 1;
            else if (date_One.getDate() < date_Two.getDate())
                return -1;
            else
                return 0;
        }
    }
}

function missingDays_missingHours_extraHours(records, leaves, dayOff, startDate, endDate) {
    let missingDays = [];
    let dayAttendance, dayLeaves, dayWeek, signIn, signOut;
    let foundSignOut = false, attended = false;
    let attendanceTime = 0, missingHours = 0, extraHours = 0;
    let compensationDates = leaves.map(function (leave) {
        if (leave.type == "Compensation Leaves") {
            return leave.compensationDate
        }
    })
    for (dStart = new Date(startDate); dStart <= endDate; dStart.setDate(dStart.getDate() + 1)) {
        dayWeek = dStart.getDay() // 0 -> sunday , 6 -> saturday
        dayAttendance = records.filter(function (record) {
            return (compareDates(record.date, dStart) == 0)
        })
        dayLeaves = leaves.filter(function (leave) {
            return (compareDates(dStart, leave.startDate) >= 0 && compareDates(dStart, leave.endDate) <= 0)
        })

        for (let i = dayAttendance.length - 1; i >= 0; i--) {
            if (dayAttendance[i].type.localeCompare("signOut") == 0) {
                foundSignOut = true;
                signOut = dayAttendance[i].date;
            }
            if (foundSignOut && dayAttendance[i].type.localeCompare("signIn") == 0) {
                signIn = dayAttendance[i].date;
                foundSignOut = false;
                attended = true;
                attendanceTime = signOut.getTime() - signIn.getTime();
                attendanceTime /= 60000
                if (dayWeek == dayOff
                    && !compensationDates.map(function (leave) {
                        return compareDates(leave, dStart) == 0
                    })) {
                    missingHours -= attendanceTime
                }
                else
                    missingHours += (504 - attendanceTime)
            }
        }
        if (!attended && dayWeek != 5 && dayWeek != dayOff && dayLeaves.length == 0) {
            missingDays.push(new Date(dStart))
        }
        foundSignOut = false;
        attended = false;
        signIn = null;
        signOut = null;
        attendanceTime = 0;
    }
    if (missingHours < 0) {
        extraHours = (missingHours * -1)
        missingHours = 0
    }
    return { missingDays: missingDays, missingHours: missingHours, extraHours: extraHours }
}

function foundAttendaceRecord(records, date) {
    let dayAttendance = records.filter(function (record) {
        return (compareDates(record.date, date) == 0)
    })
    let foundSignOut = false
    for (let i = dayAttendance.length - 1; i >= 0; i--) {
        if (dayAttendance[i].type.localeCompare("signOut") == 0) {
            foundSignOut = true;
        }
        if (foundSignOut && dayAttendance[i].type.localeCompare("signIn") == 0) {
            return true;
        }
    }
}

    module.exports = 
    { getStartEndDates: getStartEndDates, 
      compareDates: compareDates, 
      missingDays_missingHours_extraHours: missingDays_missingHours_extraHours,
      foundAttendaceRecord : foundAttendaceRecord
    };