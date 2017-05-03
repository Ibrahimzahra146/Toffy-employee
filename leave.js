var request = require('request')
var IP = process.env.SLACK_IP
var toffyHelper = require('./toffyHelper')

module.exports.sendVacationWithLeaveConfirmation = function sendLeaveSpecTimeSpecDayConfirmation(msg, fromTime, fromDate, toTime, ToDate, fromMilliseconds, toMilliseconds, email, type, timeOffcase) {
    console.log("sendVacationWithLeaveConfirmation")
    console.log("fromDate  " + fromDate)
    console.log("fromTime " + fromTime)
    console.log("toTime " + toTime)
    console.log("ToDate " + ToDate)
    console.log("fromMilliseconds " + fromMilliseconds)
    console.log("toMilliseconds " + toMilliseconds)
    var typeNum = ""
    if (type == "sick") {
        typeNum = 4
    } else if (type == "Maternity")
        typeNum = 2
    else if (type == "Paternity")
        typeNum = 3
    else if (type == "Haj")
        typeNum = 9
    else if (type == "WFH")
        typeNum = 7
    else if (type == "death")
        typeNum = 4
    else typeNum = 0
    toffyHelper.convertTimeFormat(fromTime, function (formattedFromTime, middayFrom, TimeforMilliseconds) {
        toffyHelper.convertTimeFormat(toTime, function (formattedTime, midday, TimeforMilliseconds1) {
            getWorkingDays(fromMilliseconds, toMilliseconds, email, typeNum, function (body, isValid) {
                if (isValid == true || (isValid == false && type == "sick") || (isValid == false && type == "Maternity") || (isValid == false && type == "Paternity")) {
                    var workingDays = parseFloat(body).toFixed(2);
                    var wordFromDate = new Date(fromDate).toDateString();
                    var wordTodate = new Date(ToDate).toDateString();
                    var arr = wordFromDate.toString().split(" ")
                    wordFromDate = arr[0] + ", " + arr[1] + " " + arr[2]
                    arr = wordTodate.toString().split(" ")
                    wordTodate = arr[0] + ", " + arr[1] + " " + arr[2]
                    getmessage(formattedFromTime, middayFrom, wordFromDate, formattedTime, midday, wordTodate, email, type, timeOffcase, workingDays, function (messagetext) {
                        var holidaysNotice = "\n ( Note: Any official holiday will not be deducted from your time off request.)"
                        if (type == "sick") {
                            // msg.say("Sorry to hear that :(")
                            holidaysNotice = ""
                        }
                        if (type == "WFH") {
                            workingDays = 0
                            holidaysNotice = ""
                        }
                        var text12 = {
                            "text": "",
                            "attachments": [
                                {
                                    "text": messagetext + "" + holidaysNotice,
                                    "callback_id": 'leave_with_vacation_confirm_reject',
                                    "color": "#3AA3E3",
                                    "attachment_type": "default",
                                    "actions": [
                                        {
                                            "name": 'confirm',
                                            "text": "Yes",
                                            "style": "primary",
                                            "type": "button",
                                            "value": fromTime + ";" + toTime + ";" + email + ";" + fromMilliseconds + ";" + toMilliseconds + ";" + type + ";" + workingDays + ";" + wordFromDate + ";" + wordTodate + ";" + messagetext
                                        },
                                        {
                                            "name": 'reject',
                                            "text": "No",
                                            "style": "danger",
                                            "type": "button",
                                            "value": fromTime + ";" + toTime + ";" + email + ";" + fromMilliseconds + ";" + toMilliseconds + ";" + type + ";" + workingDays + ";" + wordFromDate + ";" + wordTodate + ";" + messagetext
                                        },
                                        {
                                            "name": 'yesWithComment',
                                            "text": "Add comment",
                                            "type": "button",
                                            "value": fromTime + ";" + toTime + ";" + email + ";" + fromMilliseconds + ";" + toMilliseconds + ";" + type + ";" + workingDays + ";" + wordFromDate + ";" + wordTodate + ";" + messagetext
                                        }
                                    ],
                                }
                            ]
                        }
                        msg.say(text12)

                    })
                }
                else msg.say("Sorry! According to the time off submition rules. Your time off reuquest has been rejected automatically. Please contact your manager.")
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
    var n = arr[1].length;
    if (n == 1) {
        arr[1] = "0" + arr[1]
    }

    if (arr[0] == "13" || arr[0] == "01" || arr[0] == "1") {
        formattedTime = "01:" + arr[1];
        TimeforMilliseconds = "13:" + arr[1]
    }
    else if (arr[0] == "14" || arr[0] == "02" || arr[0] == "2") {
        formattedTime = "02:" + arr[1];
        TimeforMilliseconds = "14:" + arr[1]
    }
    else if (arr[0] == "15" || arr[0] == "03" || arr[0] == "3") {
        formattedTime = "03:" + arr[1];
        TimeforMilliseconds = "15:" + arr[1]
    }
    else if (arr[0] == "16" || arr[0] == "04" || arr[0] == "4") {
        formattedTime = "04:" + arr[1];
        TimeforMilliseconds = "16:" + arr[1]
    }
    else if (arr[0] == "17" || arr[0] == "05" || arr[0] == "05") {
        formattedTime = "05:" + arr[1];
        TimeforMilliseconds = "17:" + arr[1]
    }
    else if (arr[0] == "20" || arr[0] == "08" || arr[0] == "8") {
        formattedTime = "08:" + arr[1];
        midday = "am"
        TimeforMilliseconds = "8:" + arr[1]

    }
    else if (arr[0] == "21" || arr[0] == "09" || arr[0] == "9") {
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

function getWorkingDays(startDate, endDate, email, typeNum, callback) {



    toffyHelper.getIdFromEmail(email, function (Id) {
        var vacationBody = {
            "employee_id": Id,
            "from": startDate,
            "to": endDate,
            "type": typeNum

        }
        vacationBody = JSON.stringify(vacationBody)
        request({
            url: "http://" + IP + "/api/v1/vacation/working-days", //URL to hitDs
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': toffyHelper.general_remember_me + ";" + toffyHelper.general_session_id
            },
            body: vacationBody
            //Set the body as a stringcc
        }, function (error, response, body) {
            console.log("getWorkingDays" + response.statusCode)
            console.log("getWorkingDays" + body);
            console.log("getWorkingDays" + JSON.stringify(body));
            callback((JSON.parse(body)).workingPeriod, (JSON.parse(body)).validRequest)
        })

    })


}
function getmessage(formattedFromTime, middayFrom, fromDate, formattedTime, midday, ToDate, email, type, timeOffcase, workingDays, callback) {
    var typeText = " you asked for a time off"
    if (type == "sick") {
        typeText = " you asked for a sick" + " time off"
    } else if (type == "Maternity") {
        typeText = "  you asked for a maternity" + " time off"
    } else if (type == "Paternity") {
        typeText = " you asked for a  paternity" + " time off"
    } else if (type == "WFH")
        typeText = "you asked to work from home"
    var messageText = ""
    if (timeOffcase == 1) {
        messageText = "Okay, " + typeText + " on " + fromDate + "  at, " + formattedFromTime + " " + middayFrom + "" + " to " + ToDate + " at " + formattedTime + " " + midday + " and that would be " + workingDays + " working days" + ". Should I go ahead ?"
    } else if (timeOffcase == 2) {
        messageText = "Okay, " + typeText + " from, " + formattedFromTime + " " + middayFrom + "" + " to " + formattedTime + " " + midday + " on " + ToDate + " and that would be " + workingDays + " working days" + ". Should I go ahead ?"

    } else if (timeOffcase == 3) {
        messageText = "Okay, " + typeText + " from, " + formattedFromTime + " " + middayFrom + "" + " to " + formattedTime + " " + midday + " at " + fromDate + " and that would be " + workingDays + " working days" + ". Should I go ahead ?"

    } else if (timeOffcase == 4) {
        messageText = "Okay, " + typeText + " on, " + fromDate + " at " + formattedFromTime + " " + middayFrom + " to the end of" + ToDate + ", and that would be " + workingDays + " working days" + ". Should I go ahead ?"


    } else if (timeOffcase == 5) {
        messageText = "Okay, " + typeText + " from, " + formattedFromTime + " " + middayFrom + " to " + formattedTime + " " + midday + " today and that would be " + workingDays + " working days" + ". Should I go ahead ?"

    } else if (timeOffcase == 6) {
        messageText = "Okay,  " + typeText + " at " + formattedFromTime + " " + middayFrom + " to 5:00: pm on " + fromDate + ", and that would be " + workingDays + " working days" + ". Should I go ahead ?"

    } else if (timeOffcase == 7) {
        messageText = "Okay,  " + typeText + " on " + fromDate + "  at " + formattedFromTime + " " + middayFrom + "" + " to " + ToDate + " at " + formattedTime + " " + midday + " and that would be " + workingDays + " working days" + ". Should I go ahead ?"


    } else if (timeOffcase == 8) {
        if (type == "WFH") {
            messageText = ""
            messageText = "Okay, " + typeText + " from  " + fromDate + " to " + ToDate + ". Should I go ahead ?"

        } else
            messageText = "Okay, " + typeText + " from  " + fromDate + " to " + ToDate + " and that would be " + workingDays + " working days" + ". Should I go ahead ?"


    } else if (timeOffcase == 9) {
        if (type == "WFH") {
            messageText = ""
            messageText = "Okay," + typeText + " on " + fromDate + ". Should I go ahead ?"
        } else
            messageText = "Okay," + typeText + " on " + fromDate + " and that would be " + workingDays + " working day. Should I go ahead ? "


    } else if (timeOffcase == 10) {
        messageText = "Okay," + typeText + " from, " + formattedFromTime + " " + middayFrom + "" + " to the end of the day," + " and that would be " + workingDays + " working days" + ". Should I go ahead ?"


    } else if (timeOffcase == 11) {

    } else if (timeOffcase == 12) {

    }
    callback(messageText)

}