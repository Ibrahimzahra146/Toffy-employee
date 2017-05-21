var request = require('request')
var IP = process.env.SLACK_IP
var toffyHelper = require('./toffyHelper')
const dateHelper = require('./DateEngine/DateHelper.js')
const vacationOverllaping = require('././VacationOverllaping/overlappedVacations.js')

module.exports.sendVacationWithLeaveConfirmation = function sendLeaveSpecTimeSpecDayConfirmation(msg, fromTime, fromDate, toTime, ToDate, fromMilliseconds, toMilliseconds, email, type, timeOffcase) {
    console.log("send VacationWithLeaveConfirmation")
    console.log("fromDate  " + fromDate)
    console.log("fromTime " + fromTime)
    console.log("toTime " + toTime)
    console.log("ToDate " + ToDate)
    console.log("fromMilliseconds " + fromMilliseconds)
    console.log("toMilliseconds " + toMilliseconds)
    console.log("TYPEEE" + type)
    var holidaysNotice = ""
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
    else if (type == "Wedding")
        typeNum = 8
    else typeNum = 0
    console.log("fromTime" + fromTime)
    console.log("toTime" + toTime)
    dateHelper.convertTimeFormat(fromTime, function (formattedFromTime, middayFrom, TimeforMilliseconds) {
        console.log("formattedFromTime" + formattedFromTime)
        dateHelper.convertTimeFormat(toTime, function (formattedTime, midday, TimeforMilliseconds1) {
            getWorkingDays(fromMilliseconds, toMilliseconds, email, typeNum, function (workingPeriod, isValid, reason, containsHolidays, overlappedVacations, body) {
                getStartAndEndTime(body, formattedFromTime, formattedTime);
                if (workingPeriod != 1000) {
                    var workingDays = parseFloat(workingPeriod).toFixed(2);
                    if (workingDays != 0.0 || containsHolidays == true) {
                        if (isValid == true || (isValid == false && type == "sick") || (isValid == false && type == "Wedding") || (isValid == false && type == "Paternity")) {

                            var fromDateServer = new Date(body.timeSlotFrom.date)
                            fromDateServer.setHours(body.timeSlotFrom.hour)
                            fromDateServer.setMinutes(body.timeSlotFrom.minute)
                            //
                            var toDateWordServer = new Date(body.toTimeSlot.date)
                            toDateWordServer.setHours(body.toTimeSlot.hour)
                            toDateWordServer.setMinutes(body.toTimeSlot.minute)
                            /* var wordFromDate = new Date(fromDate).toDateString();
                             var wordTodate = new Date(ToDate).toDateString();
                             var arr = wordFromDate.toString().split(" ")
                             wordFromDate = arr[0] + ", " + arr[1] + " " + arr[2]
                             arr = wordTodate.toString().split(" ")
                             wordTodate = arr[0] + ", " + arr[1] + " " + arr[2]*/
                            dateHelper.converDateToWords(fromDateServer, toDateWordServer, 0, function (wordFromDate, wordTodate) {


                                getmessage(formattedFromTime, middayFrom, wordFromDate, formattedTime, midday, wordTodate, email, type, timeOffcase, workingDays, overlappedVacations, function (messagetext) {
                                    var addCommentButton = ""
                                    if (containsHolidays == true)
                                        holidaysNotice = "\n ( Note: Any official holiday will not be deducted from your time off request.)"
                                    if (type == "sick") {
                                        // msg.say("Sorry to hear that :(")
                                        holidaysNotice = ""
                                    }
                                    if (type == "WFH") {
                                        workingDays = 0
                                        holidaysNotice = ""
                                    }
                                    if (type == "sick" || type == "personal") {
                                        addCommentButton = {
                                            "name": 'yesWithComment',
                                            "text": "Add comment",
                                            "type": "button",
                                            "value": fromTime + ";" + toTime + ";" + email + ";" + fromMilliseconds + ";" + toMilliseconds + ";" + type + ";" + workingDays + ";" + wordFromDate + ";" + wordTodate + ";" + messagetext
                                        }
                                    }
                                    messagetext = messagetext + "" + holidaysNotice

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
                                                        "value": fromTime + ";" + toTime + ";" + email + ";" + fromMilliseconds + ";" + toMilliseconds + ";" + type + ";" + workingDays + ";" + wordFromDate + ";" + wordTodate + ";" + messagetext
                                                    },
                                                    {
                                                        "name": 'reject',
                                                        "text": "No",
                                                        "style": "danger",
                                                        "type": "button",
                                                        "value": fromTime + ";" + toTime + ";" + email + ";" + fromMilliseconds + ";" + toMilliseconds + ";" + type + ";" + workingDays + ";" + wordFromDate + ";" + wordTodate + ";" + messagetext
                                                    }, addCommentButton

                                                ],
                                            }
                                        ]
                                    }
                                    msg.say(text12)
                                })
                                //else vacationOverllaping.determinOverllapingCase(msg, email, overlappedVacations, messagetext, holidaysNotice, fromTime, toTime, email, fromMilliseconds, toMilliseconds, type, workingDays, )

                            })
                        } else msg.say("Sorry! According to the time off submition rules. Your time off reuquest has been rejected automatically.\n" + reason + ". Please contact your manager.")

                    }
                    else msg.say("It's already a time off.")
                } else msg.say("Sorry! I am a bit confused :white_frowning_face:")
            })


        });


    })
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


function getWorkingDays(startDate, endDate, email, typeNum, callback) {


    try {
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

                //console.log(" (JSON.parse(body)).validRequest.reason" + (JSON.parse(body)).validRequest.reason)
                if (response.statusCode == 500) {
                    callback(1000, "no ")
                } else if ((JSON.parse(body)).validRequest.overlappedVacations) {
                    console.log("overllaped vacation" + JSON.stringify(body))
                    callback((JSON.parse(body)).workingPeriod, (JSON.parse(body)).validRequest.isValid, (JSON.parse(body)).validRequest.reason, (JSON.parse(body)).validRequest.containsHolidays, (JSON.parse(body)).validRequest.overlappedVacations, (JSON.parse(body)))

                }
                else {
                    console.log("no overllaped vacation" + JSON.stringify(body))
                    console.log()
                    callback((JSON.parse(body)).workingPeriod, (JSON.parse(body)).validRequest.isValid, (JSON.parse(body)).validRequest.reason, (JSON.parse(body)).validRequest.containsHolidays, "", (JSON.parse(body)))

                }
            })

        })
    } catch (error) {
        console.log("Error:" + error)

    }



}
function getmessage(formattedFromTime, middayFrom, fromDate, formattedTime, midday, ToDate, email, type, timeOffcase, workingDays, overlappedVacations, callback) {
    var typeText = "Okay, you asked for a time off"
    if (type == "sick") {
        typeText = " you asked for a sick" + " time off :persevere:,"
    } else if (type == "Maternity") {
        typeText = "Congratulations! a great joy is coming. Many best wishes,"
    } else if (type == "Paternity") {
        typeText = "Congratulations on your baby’s paternity,"
    } else if (type == "WFH")
        typeText = "Okay, you asked to work from home"
    else if (type == "death")
        typeText = "Sorry about your loss, our deepest condolences, "
    else if (type == "Wedding")
        typeText = "Congratulations on your marriage,"
    var messageText = ""
    generateOverllapedVacationsMessae(overlappedVacations, function (overlppedMsg) {



        if (timeOffcase == 1) {
            messageText = typeText + " on " + fromDate + "  at, " + formattedFromTime + " " + middayFrom + "" + " to " + ToDate + " at " + formattedTime + " " + midday + " and that would be " + workingDays + " working days. " + overlppedMsg + ". Should I go ahead ?"
        } else if (timeOffcase == 2) {
            messageText = typeText + " from, " + formattedFromTime + " " + middayFrom + "" + " to " + formattedTime + " " + midday + " on " + ToDate + " and that would be " + workingDays + " working days. " + overlppedMsg + ". Should I go ahead ?"

        } else if (timeOffcase == 3) {
            messageText = typeText + " from, " + fromDate + " to " + ToDate + " and that would be " + workingDays + " working days. " + overlppedMsg + ". Should I go ahead ?"

        } else if (timeOffcase == 4) {
            messageText = typeText + " on, " + fromDate + " at " + formattedFromTime + " " + middayFrom + " to the end of" + ToDate + ", and that would be " + workingDays + " working days. " + overlppedMsg + ". Should I go ahead ?"


        } else if (timeOffcase == 5) {
            messageText = + typeText + " from, " + formattedFromTime + " " + middayFrom + " to " + formattedTime + " " + midday + " today and that would be " + workingDays + " working days. " + overlppedMsg + ". Should I go ahead ?"

        } else if (timeOffcase == 6) {
            messageText = typeText + " at " + formattedFromTime + " " + middayFrom + " to 5:00: pm on " + fromDate + ", and that would be " + workingDays + " working days. " + overlppedMsg + ". Should I go ahead ?"

        } else if (timeOffcase == 7) {
            messageText = typeText + " on " + fromDate + "  at " + formattedFromTime + " " + middayFrom + "" + " to " + ToDate + " at " + formattedTime + " " + midday + " and that would be " + workingDays + " working days. " + overlppedMsg + ". Should I go ahead ?"


        } else if (timeOffcase == 8) {
            if (type == "WFH") {
                messageText = ""
                messageText = typeText + " from  " + fromDate + " to " + ToDate + ". Should I go ahead ?"

            } else
                messageText = typeText + " from  " + fromDate + " to " + ToDate + " and that would be " + workingDays + " working days. " + overlppedMsg + ". Should I go ahead ?"


        } else if (timeOffcase == 9) {
            if (type == "WFH") {
                messageText = ""
                messageText = typeText + " on " + fromDate + ". Should I go ahead ?"
            } else
                messageText = typeText + " on " + fromDate + " to " + ToDate" and that would be " + workingDays + " working day. " + overlppedMsg + " Should I go ahead ? "


        } else if (timeOffcase == 10) {
            messageText = typeText + " from, " + formattedFromTime + " " + middayFrom + "" + " to the end of the day," + " and that would be " + workingDays + " working days. " + overlppedMsg + ". Should I go ahead ?"


        } else if (timeOffcase == 11) {

        } else if (timeOffcase == 12) {

        }
        callback(messageText)
    })

}
function generateOverllapedVacationsMessae(overlappedVacations, callback) {
    console.log("JSON.stringify(overlappedVacations)" + JSON.stringify(overlappedVacations))
    var overlppedMsg = ""
    if (overlappedVacations != "") {
        var i = 0
        while (overlappedVacations[i]) {
            if (overlppedMsg != "")
                overlppedMsg = overlppedMsg + " and "
            dateHelper.converDateToWords(overlappedVacations[i].fromDate, overlappedVacations[i].toDate, 0, function (fromDateWord, toDateWord) {
                overlppedMsg = overlppedMsg + " from " + fromDateWord + " to " + toDateWord
            })

            i++;
        }
        console.log("overlppedMsg::" + overlppedMsg)
        overlppedMsg = "\n[Note]: There is an already taken time off " + overlppedMsg + " and it will be overwritten when you press \"Yes\"."
        callback(overlppedMsg)
    } else callback(overlppedMsg)

}
function getStartAndEndTime(body, startTime, EndTime) {
    var startSlotTimeHours = body.timeSlotFrom.startSlotTimeHours
    var endSlotTimeHours = body.timeSlotFrom.endSlotTimeHours
    var startSlotTimeMinutes = body.timeSlotFrom.startSlotTimeMinutes
    var endSlotTimeMinutes = body.timeSlotFrom.endSlotTimeMinutes
    var date = new Date(startSlotTimeHours + ":" + startSlotTimeHours)

    dateHelper.convertTimeFormat

    console.log("(JSON.parse(body)).timeSlotFrom.startSlotTimeHours" + body.timeSlotFrom.startSlotTimeHours)
    console.log("(JSON.parse(body)).timeSlotFrom.endSlotTimeHours" + body.timeSlotFrom.endSlotTimeHours)
    console.log("(JSON.parse(body)).timeSlotFrom.startSlotTimeMinutes" + body.timeSlotFrom.startSlotTimeMinutes)
    console.log("startTime" + startTime)
    console.log("EndTime" + EndTime)



}
