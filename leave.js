var request = require('request')
var IP = process.env.SLACK_IP
var toffyHelper = require('./toffyHelper')

module.exports.sendLeaveSpecTimeTodayConfirmation = function sendLeaveSpecTimeTodayConfirmation(msg, time, date, timeInMilliseconds, email, type) {
    if (type == "sickLeave") {
        type = "sick"
    }
    console.log("sendLeaveSpecTimeTodayConfirmation::")
    toffyHelper.convertTimeFormat(time, function (formattedTime, midday, TimeforMilliseconds) {
        toffyHelper.converDateToMilliseconds("17:00:00", function (milliSeconds1) {
            getWorkingDays(timeInMilliseconds, milliSeconds1, email, function (body) {
                var workingDays = parseFloat(body).toFixed(1)

                var text12 = {
                    "text": "",
                    "attachments": [
                        {
                            "text": "Okay, you asked for a leave at " + date + " from  " + formattedTime + " " + midday + "  to 5:00 pm. Should I go ahead ?",
                            "callback_id": 'leave_confirm_reject',
                            "color": "#3AA3E3",
                            "attachment_type": "default",
                            "actions": [
                                {
                                    "name": 'confirm',
                                    "text": "Yes",
                                    "style": "primary",
                                    "type": "button",
                                    "value": time + "," + email + "," + timeInMilliseconds + "," + milliSeconds1 + "," + date + "," + type + "," + workingDays
                                },
                                {
                                    "name": 'reject',
                                    "text": "No",
                                    "style": "danger",
                                    "type": "button",
                                    "value": time + "," + email + "," + timeInMilliseconds + "," + milliSeconds1 + "," + date + "," + type + "," + workingDays
                                }
                            ]
                        }
                    ]
                }
                msg.say(text12)
            })

        })

    });
}//-------------------------------------
module.exports.sendLeaveSpecTimeSpecDayConfirmation = function sendLeaveSpecTimeSpecDayConfirmation(msg, time, date, email, type) {
    console.log("The time is " + time)
    console.log("The date is " + date)
    toffyHelper.convertTimeFormat(time, function (formattedTime, midday, TimeforMilliseconds) {
        converDateToMillisecondsWithSpecDate(TimeforMilliseconds, date, function (milliSeconds) {
            converDateToMillisecondsWithSpecDate("17:00:00", date, function (milliSeconds1) {
                getWorkingDays(milliSeconds, milliSeconds1, email, function (body) {
                    var workingDays = parseFloat(body).toFixed(1)
                    console.log("milliSeconds--->" + milliSeconds)
                    console.log("milliSeconds1--->" + milliSeconds1)

                    var text12 = {
                        "text": "",
                        "attachments": [
                            {
                                "text": "Okay, you asked for a leave on " + date + " from " + formattedTime + "  " + midday + "  to 5:00 pm. Should I go ahead ?",
                                "callback_id": 'leave_spectime_specDay_confirm_reject',
                                "color": "#3AA3E3",
                                "attachment_type": "default",
                                "actions": [
                                    {
                                        "name": 'confirm',
                                        "text": "Yes",
                                        "style": "primary",
                                        "type": "button",
                                        "value": time + "," + date + "," + email + "," + milliSeconds + "," + milliSeconds1 + "," + type + "," + workingDays

                                    },
                                    {
                                        "name": 'reject',
                                        "text": "No",
                                        "style": "danger",
                                        "type": "button",
                                        "value": time + "," + date + "," + email + "," + milliSeconds + "," + milliSeconds1 + "," + type + "," + workingDays
                                    }
                                ]
                            }
                        ]
                    }
                    msg.say(text12)

                });
            });
        });
    })
}
module.exports.sendLeaveRangeTimeTodayConfirmation = function sendLeaveRangeTimeTodayConfirmation(msg, fromTime, toTime, email, type) {
    console.log("RangeTimeToday")
    toffyHelper.convertTimeFormat(fromTime, function (formattedFromTime, middayFrom, TimeforMilliseconds) {
        toffyHelper.convertTimeFormat(toTime, function (formattedTime, midday, TimeforMilliseconds1) {
            converDateToMilliseconds(TimeforMilliseconds, function (milliSeconds) {
                converDateToMilliseconds(TimeforMilliseconds1, function (milliSeconds1) {
                    getWorkingDays(milliSeconds, milliSeconds1, email, function (body) {
                        var workingDays = parseFloat(body).toFixed(1);
                        var text12 = {
                            "text": "",
                            "attachments": [
                                {
                                    "text": "Okay, you asked for a leave today  from,  " + formattedFromTime + " " + middayFrom + "" + "  to   " + formattedTime + " " + midday + ". Should I go ahead ?",
                                    "callback_id": 'leave_rangeTime_today_confirm_reject',
                                    "color": "#3AA3E3",
                                    "attachment_type": "default",
                                    "actions": [
                                        {
                                            "name": 'confirm',
                                            "text": "Yes",
                                            "style": "primary",
                                            "type": "button",
                                            "value": fromTime + "," + toTime + "," + email + "," + milliSeconds + "," + milliSeconds1 + "," + type + "," + workingDays
                                        },
                                        {
                                            "name": 'reject',
                                            "text": "No",
                                            "style": "danger",
                                            "type": "button",
                                            "value": fromTime + "," + toTime + "," + email + "," + milliSeconds + "," + milliSeconds1 + "," + type + "," + workingDays
                                        }
                                    ]
                                }
                            ]
                        }
                        msg.say(text12)
                    })
                })
            });
        });
    });

}
module.exports.sendLeaveRangeTimeSpecDayConfirmation = function sendLeaveRangeTimeSpecDayConfirmation(msg, fromTime, toTime, date, email, type) {
    toffyHelper.convertTimeFormat(fromTime, function (formattedFromTime, middayFrom, TimeforMilliseconds) {
        toffyHelper.convertTimeFormat(toTime, function (formattedTime, midday, TimeforMilliseconds1) {
            converDateToMillisecondsWithSpecDate(TimeforMilliseconds, date, function (milliSeconds) {
                converDateToMillisecondsWithSpecDate(TimeforMilliseconds1, date, function (milliSeconds1) {
                    getWorkingDays(milliSeconds, milliSeconds1, email, function (body) {
                        var workingDays = parseFloat(body).toFixed(1)
                        var text12 = {
                            "text": "",
                            "attachments": [
                                {
                                    "text": "Okay, you asked for a leave  on " + date + " from " + formattedFromTime + " " + middayFrom + "" + "  to  " + formattedTime + " " + midday + ". Should I go ahead ?",
                                    "callback_id": 'leave_rangeTime_specDay_confirm_reject',
                                    "color": "#3AA3E3",
                                    "attachment_type": "default",
                                    "actions": [
                                        {
                                            "name": 'confirm',
                                            "text": "Yes",
                                            "style": "primary",
                                            "type": "button",
                                            "value": fromTime + "," + toTime + "," + date + "," + email + "," + milliSeconds + "," + milliSeconds1 + "," + type + "," + workingDays
                                        },
                                        {
                                            "name": 'reject',
                                            "text": "No",
                                            "style": "danger",
                                            "type": "button",
                                            "value": fromTime + "," + toTime + "," + date + "," + email + "," + milliSeconds + "," + milliSeconds1 + "," + type + "," + workingDays
                                        }
                                    ]
                                }
                            ]
                        }
                        msg.say(text12)
                    });
                });
            });
        })
    })
}

/*

*/
module.exports.sendVacationWithLeaveConfirmation = function sendLeaveSpecTimeSpecDayConfirmation(msg, fromTime, fromDate, toTime, ToDate, fromMilliseconds, toMilliseconds, email, type, timeOffcase) {
    console.log("sendVacationWithLeaveConfirmation")
    console.log("fromDate " + fromDate)
    console.log("fromTime " + fromTime)
    console.log("toTime " + toTime)
    console.log("ToDate " + ToDate)
    console.log("fromMilliseconds " + fromMilliseconds)
    console.log("toMilliseconds " + toMilliseconds)
    toffyHelper.convertTimeFormat(fromTime, function (formattedFromTime, middayFrom, TimeforMilliseconds) {
        toffyHelper.convertTimeFormat(toTime, function (formattedTime, midday, TimeforMilliseconds1) {
            getWorkingDays(fromMilliseconds, toMilliseconds, email, function (body) {
                var workingDays = parseFloat(body).toFixed(1);

                getmessage(formattedFromTime, middayFrom, fromDate, formattedTime, midday, ToDate, email, type, timeOffcase, workingDays, function (messagetext) {

                    if (type == "sick") {
                        msg.say("Sorry to hear that :(")
                    }

                    var text12 = {
                        "text": "",
                        "attachments": [
                            {
                                "text": messagetext,
                                "callback_id": 'leave_with_vacation_confirm_reject',
                                "color": "#3AA3E3",
                                "attachment_type": "default",
                                "actions": [
                                    {
                                        "name": 'confirm',
                                        "text": "Yes",
                                        "style": "primary",
                                        "type": "button",
                                        "value": fromTime + "," + toTime + "," + email + "," + fromMilliseconds + "," + toMilliseconds + "," + type + "," + workingDays + "," + fromDate + "," + ToDate
                                    },
                                    {
                                        "name": 'reject',
                                        "text": "No",
                                        "style": "danger",
                                        "type": "button",
                                        "value": fromTime + "," + toTime + "," + email + "," + fromMilliseconds + "," + toMilliseconds + "," + type + "," + workingDays + "," + fromDate + "," + ToDate
                                    }
                                ]
                            }
                        ]
                    }
                    msg.say(text12)
                })
            })
        });

    })
}
module.exports.convertTimeFormat = function convertTimeFormat(time, callback) {
    console.log("The Time is =" + time)
    var arr = time.toString().split(":")
    var formattedTime = ""
    var midday = "pm";
    var TimeforMilliseconds = ""
    if (arr[0] == "13" || arr[0] == "01") {
        formattedTime = "01:" + arr[1];
        TimeforMilliseconds = "13:" + arr[1]
    }
    else if (arr[0] == "14" || arr[0] == "02") {
        formattedTime = "02:" + arr[1];
        TimeforMilliseconds = "14:" + arr[1]
    }
    else if (arr[0] == "15" || arr[0] == "03") {
        formattedTime = "03:" + arr[1];
        TimeforMilliseconds = "15:" + arr[1]
    }
    else if (arr[0] == "16" || arr[0] == "04") {
        formattedTime = "04:" + arr[1];
        TimeforMilliseconds = "16:" + arr[1]
    }
    else if (arr[0] == "17" || arr[0] == "05") {
        formattedTime = "05:" + arr[1];
        TimeforMilliseconds = "17:" + arr[1]
    }
    else if (arr[0] == "20" || arr[0] == "08") {
        formattedTime = "08:" + arr[1];
        midday = "am"
        TimeforMilliseconds = "8:" + arr[1]

    }
    else if (arr[0] == "21" || arr[0] == "09") {
        formattedTime = "09:" + arr[1];
        midday = "am"
        TimeforMilliseconds = "9:" + arr[1]
    }
    else if (arr[0] == "22" || arr[0] == "10") {
        formattedTime = "10:" + arr[1];
        midday = "am"
        TimeforMilliseconds = "10:" + arr[1]
    }
    else if (arr[0] == "23" || arr[0] == "11") {
        formattedTime = "11:" + arr[1];
        midday = "am"
        TimeforMilliseconds = "11:" + arr[1]
    }
    else if (arr[0] == "00" || arr[0] == "12") {
        formattedTime = "12:" + arr[1];
        midday = "am"
        TimeforMilliseconds = "12:" + arr[1]
    }

    else {
        formattedTime = arr[0] + ":" + arr[1];
        midday = "am";
    }
    console.log("TimeforMilliseconds" + TimeforMilliseconds)
    callback(formattedTime, midday, TimeforMilliseconds)
}
function converDateToMilliseconds(TimeforMilliseconds, callback) {
    console.log("arrive at converDateToMilliseconds" + TimeforMilliseconds)
    var arr = TimeforMilliseconds.toString().split(":")

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd
    }

    if (mm < 10) {
        mm = '0' + mm
    }

    today = yyyy + '-' + mm + '-' + dd;

    today + " " + TimeforMilliseconds
    y = new Date(today)
    y.setHours((arr[0] - 2))
    y.setMinutes(arr[1])
    var milliSeconds = y.getTime()
    callback(milliSeconds)
}
function converDateToMillisecondsWithSpecDate(TimeforMilliseconds, date, callback) {
    console.log("arrive at converDateToMilliseconds" + TimeforMilliseconds)
    var arr = TimeforMilliseconds.toString().split(":")

    var today = new Date();
    today = date + " " + TimeforMilliseconds


    y = new Date(today)
    y.setHours((arr[0] - 2))
    y.setMinutes(arr[1])
    var milliSeconds = y.getTime()
    console.log("milliSeconds===>" + milliSeconds)
    callback(milliSeconds)
}

function getWorkingDays(startDate, endDate, email, callback) {
    var vacationBody = {
        "from": startDate,
        "to": endDate

    }
    vacationBody = JSON.stringify(vacationBody)

    toffyHelper.getNewSessionwithCookie(email, function (cookies, session_Id) {
        toffyHelper.generalCookies = cookies
        request({
            url: "http://" + IP + "/api/v1/vacation/working-days", //URL to hitDs
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookies + ";" + session_Id
            },
            body: vacationBody
            //Set the body as a stringcc
        }, function (error, response, body) {
            console.log("getWorkingDays" + response.statusCode)
            console.log("getWorkingDays" + body);
            console.log("getWorkingDays" + JSON.stringify(body));
            callback(body)
        })

    })
}
function getmessage(formattedFromTime, middayFrom, fromDate, formattedTime, midday, ToDate, email, type, timeOffcase, workingDays, callback) {
    var typeText = ""
    if (type == "sick") {
        typeText = " sick"
    }
    var messageText = ""
    if (timeOffcase == 1) {
        messageText = "Okay, you asked for a" + typeText + " time off on " + fromDate + "  at, " + formattedFromTime + " " + middayFrom + "" + " to " + ToDate + " at " + formattedTime + " " + midday + " and that would be " + workingDays + " working days" + ". Should I go ahead ?"
    } else if (timeOffcase == 2) {
        messageText = "Okay, you asked for a" + typeText + " time off from, " + formattedFromTime + " " + middayFrom + "" + " to " + formattedTime + " " + midday + " on " + ToDate + " and that would be " + workingDays + " working days" + ". Should I go ahead ?"

    } else if (timeOffcase == 3) {
        messageText = "Okay, you asked for a" + typeText + " time off from, " + formattedFromTime + " " + middayFrom + "" + " to " + formattedTime + " " + midday + " at " + fromDate + " and that would be " + workingDays + " working days" + ". Should I go ahead ?"

    } else if (timeOffcase == 4) {
        messageText = "Okay, you asked for a" + typeText + " time off on, " + fromDate + " at " + formattedFromTime + " " + middayFrom + " to the end of  " + fromDate + ", and that would be " + workingDays + " working days" + ". Should I go ahead ?"


    } else if (timeOffcase == 5) {
        messageText = "Okay, you asked for a" + typeText + " time off from, " + formattedFromTime + " " + middayFrom + " to " + formattedTime + " " + midday + " todaym and that would be " + workingDays + " working days" + ". Should I go ahead ?"

    } else if (timeOffcase == 6) {
        messageText = "Okay, you asked for a " + typeText + "time off at " + formattedFromTime + " " + middayFrom + " to 5:00: pm on " + fromDate + ", and that would be " + workingDays + " working days" + ". Should I go ahead ?"

    } else if (timeOffcase == 7) {
        messageText = "Okay, you asked for a " + typeText + "time off on " + fromDate + "  at " + formattedFromTime + " " + middayFrom + "" + " to " + ToDate + " at " + formattedTime + " " + midday + " and that would be " + workingDays + " working days" + ". Should I go ahead ?"


    } else if (timeOffcase == 8) {
        messageText = "Okay, you asked for a" + typeText + " time off from  " + fromDate + " to " + ToDate + " and that would be " + workingDays + " working days" + ". Should I go ahead ?"


    } else if (timeOffcase == 9) {
        messageText = "Okay, you asked for a" + typeText + " time off on " + fromDate + " and that would be 1 working days. Should I go ahead ? "


    } else if (timeOffcase == 10) {
        messageText = "Okay, you asked for a" + typeText + " time off from, " + formattedFromTime + " " + middayFrom + "" + " to the end of the day  " + " and that would be " + workingDays + " working days" + ". Should I go ahead ?"


    } else if (timeOffcase == 11) {

    } else if (timeOffcase == 12) {

    }
    callback(messageText)

}