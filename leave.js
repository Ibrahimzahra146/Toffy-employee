module.exports.sendLeaveSpecTimeTodayConfirmation = function sendLeaveSpecTimeTodayConfirmation(msg, time, email) {
    convertTimeFormat(time, function (formattedTime, midday) {
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
                            "value": time + "," + email
                        },
                        {
                            "name": 'reject',
                            "text": "No",
                            "style": "danger",
                            "type": "button",
                            "value": time + "," + email
                        }
                    ]
                }
            ]
        }
        msg.say(text12)
    });


}//-------------------------------------
module.exports.sendLeaveSpecTimeSpecDayConfirmation = function sendLeaveSpecTimeSpecDayConfirmation(msg, time, date, email) {
    convertTimeFormat(time, function (formattedTime, midday) {
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
                            "value": time + "," + date + "," + email
                        },
                        {
                            "name": 'reject',
                            "text": "No",
                            "style": "danger",
                            "type": "button",
                            "value": time + "," + date + "," + email
                        }
                    ]
                }
            ]
        }
        msg.say(text12)
    });
}
module.exports.sendLeaveRangeTimeTodayConfirmation = function sendLeaveRangeTimeTodayConfirmation(msg, fromTime, toTime, email) {
    console.log("RangeTimeToday")
    convertTimeFormat(fromTime, function (formattedFromTime, middayFrom) {
        convertTimeFormat(toTime, function (formattedTime, midday) {
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
                                "value": fromTime + "," + toTime + "," + email
                            },
                            {
                                "name": 'reject',
                                "text": "No",
                                "style": "danger",
                                "type": "button",
                                "value": fromTime + "," + toTime + "," + email
                            }
                        ]
                    }
                ]
            }
            msg.say(text12)


        });
    });

}
module.exports.sendLeaveRangeTimeSpecDayConfirmation = function sendLeaveRangeTimeSpecDayConfirmation(msg, fromTime, toTime, date, email) {
    convertTimeFormat(fromTime, function (formattedFromTime, middayFrom) {
        convertTimeFormat(toTime, function (formattedTime, midday) {
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
                                "value": fromTime + "," + toTime + "," + date + "," + email
                            },
                            {
                                "name": 'reject',
                                "text": "No",
                                "style": "danger",
                                "type": "button",
                                "value": fromTime + "," + toTime + "," + date + "," + email
                            }
                        ]
                    }
                ]
            }
            msg.say(text12)
        });
    });
}
function convertTimeFormat(time, callback) {
    var arr = time.toString().split(":")
    var formattedTime = ""
    var midday = "pm";
    if (arr[0] == "13" || arr[0] == "01")
        formattedTime = "01:" + arr[1];
    else if (arr[0] == "14" || arr[0] == "02")
        formattedTime = "02:" + arr[1];
    else if (arr[0] == "15" || arr[0] == "03")
        formattedTime = "03:" + arr[1];
    else if (arr[0] == "16" || arr[0] == "04")
        formattedTime = "04:" + arr[1];
    else if (arr[0] == "17" || arr[0] == "05")
        formattedTime = "05:" + arr[1];
    else if (arr[0] == "20") {
        formattedTime = "08:" + arr[1];
        midday = "am"
    }
    else if (arr[0] == "21" || arr[0] == "09") {
        formattedTime = "09:" + arr[1];
        midday = "am"
    }
    else if (arr[0] == "22" || arr[0] == "10") {
        formattedTime = "10:" + arr[1];
        midday = "am"
    }
    else if (arr[0] == "23" || arr[0] == "11") {
        formattedTime = "11:" + arr[1];
        midday = "am"
    }
    else if (arr[0] == "00" || arr[0] == "12") {
        formattedTime = "12:" + arr[1];
        midday = "am"
    }
    else {
        formattedTime = arr[0] + ":" + arr[1];
        midday = "am";
    }

    callback(formattedTime, midday)
}