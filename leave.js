module.exports.sendLeaveSpecTimeTodayConfirmation = function sendLeaveSpecTimeTodayConfirmation(msg, time, email, type) {
    console.log("sendLeaveSpecTimeTodayConfirmation::")
    convertTimeFormat(time, function (formattedTime, midday, TimeforMilliseconds) {
        converDateToMilliseconds(TimeforMilliseconds, function (milliSeconds) {
            converDateToMilliseconds("17:00:00", function (milliSeconds1) {
                console.log("Converted Time---->" + time)
                console.log("Converted Time---->" + TimeforMilliseconds)
                console.log("Converted Time---->" + milliSeconds)
                console.log("Converted Time---->" + milliSeconds1)
                var text12 = {
                    "text": "",
                    "attachments": [
                        {
                            "text": "Okay, you asked for a leave today from  " + formattedTime + " " + midday + "  to 5:00 pm   . Should I go ahead ?",
                            "callback_id": 'leave_confirm_reject',
                            "color": "#3AA3E3",
                            "attachment_type": "default",
                            "actions": [
                                {
                                    "name": 'confirm',
                                    "text": "Yes",
                                    "style": "primary",
                                    "type": "button",
                                    "value": time + "," + email + "," + milliSeconds + "," + milliSeconds1 + "," + type
                                },
                                {
                                    "name": 'reject',
                                    "text": "No",
                                    "style": "danger",
                                    "type": "button",
                                    "value": time + "," + email + "," + milliSeconds + "," + milliSeconds1 + "," + type
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
    convertTimeFormat(time, function (formattedTime, midday, TimeforMilliseconds) {
        converDateToMillisecondsWithSpecDate(TimeforMilliseconds, date, function (milliSeconds) {
            converDateToMillisecondsWithSpecDate("17:00:00", date, function (milliSeconds1) {
                console.log("milliSeconds--->" + milliSeconds)
                console.log("milliSeconds1--->" + milliSeconds1)

                var text12 = {
                    "text": "",
                    "attachments": [
                        {
                            "text": "Okay, you asked for a leave on " + date + " from " + formattedTime + "  " + midday + "  to 5:00 pm . Should I go ahead ?",
                            "callback_id": 'leave_spectime_specDay_confirm_reject',
                            "color": "#3AA3E3",
                            "attachment_type": "default",
                            "actions": [
                                {
                                    "name": 'confirm',
                                    "text": "Yes",
                                    "style": "primary",
                                    "type": "button",
                                    "value": time + "," + date + "," + email + "," + milliSeconds + "," + milliSeconds1 + "," + type

                                },
                                {
                                    "name": 'reject',
                                    "text": "No",
                                    "style": "danger",
                                    "type": "button",
                                    "value": time + "," + date + "," + email + "," + milliSeconds + "," + milliSeconds1 + "," + type
                                }
                            ]
                        }
                    ]
                }
                msg.say(text12)

            });
        });
    });
}
module.exports.sendLeaveRangeTimeTodayConfirmation = function sendLeaveRangeTimeTodayConfirmation(msg, fromTime, toTime, email, type) {
    console.log("RangeTimeToday")
    convertTimeFormat(fromTime, function (formattedFromTime, middayFrom, TimeforMilliseconds) {
        convertTimeFormat(toTime, function (formattedTime, midday, TimeforMilliseconds1) {
            converDateToMilliseconds(TimeforMilliseconds, function (milliSeconds) {
                converDateToMilliseconds(TimeforMilliseconds1, function (milliSeconds1) {
                    var text12 = {
                        "text": "",
                        "attachments": [
                            {
                                "text": "Okay, you asked for a leave today  from,  " + formattedFromTime + " " + middayFrom + "" + "  to   " + formattedTime + " " + midday + "  . Should I go ahead ?",
                                "callback_id": 'leave_rangeTime_today_confirm_reject',
                                "color": "#3AA3E3",
                                "attachment_type": "default",
                                "actions": [
                                    {
                                        "name": 'confirm',
                                        "text": "Yes",
                                        "style": "primary",
                                        "type": "button",
                                        "value": fromTime + "," + toTime + "," + email + "," + milliSeconds + "," + milliSeconds1 + "," + type
                                    },
                                    {
                                        "name": 'reject',
                                        "text": "No",
                                        "style": "danger",
                                        "type": "button",
                                        "value": fromTime + "," + toTime + "," + email + "," + milliSeconds + "," + milliSeconds1 + "," + type
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

}
module.exports.sendLeaveRangeTimeSpecDayConfirmation = function sendLeaveRangeTimeSpecDayConfirmation(msg, fromTime, toTime, date, email, type) {
    convertTimeFormat(fromTime, function (formattedFromTime, middayFrom, TimeforMilliseconds) {
        convertTimeFormat(toTime, function (formattedTime, midday, TimeforMilliseconds1) {
            converDateToMillisecondsWithSpecDate(TimeforMilliseconds, date, function (milliSeconds) {
                converDateToMillisecondsWithSpecDate(TimeforMilliseconds1, date, function (milliSeconds1) {
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
                                        "value": fromTime + "," + toTime + "," + date + "," + email + "," + milliSeconds + "," + milliSeconds1 + "," + type
                                    },
                                    {
                                        "name": 'reject',
                                        "text": "No",
                                        "style": "danger",
                                        "type": "button",
                                        "value": fromTime + "," + toTime + "," + date + "," + email + "," + milliSeconds + "," + milliSeconds1 + "," + type
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
function convertTimeFormat(time, callback) {
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
    else if (arr[0] == "20") {
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