const env = require('./Public/configrations.js')

const vacationOverllaping = require('././VacationOverllaping/overlappedVacations.js')

module.exports.sendVacationWithLeaveConfirmation = function sendLeaveSpecTimeSpecDayConfirmation(msg, fromTime, fromDate, toTime, ToDate, fromMilliseconds, toMilliseconds, email, type, timeOffcase) {
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

    env.dateHelper.convertTimeFormat(fromTime, function (formattedFromTime, middayFrom, TimeforMilliseconds) {
        console.log("formattedFromTime" + formattedFromTime)
        env.dateHelper.convertTimeFormat(toTime, function (formattedTime, midday, TimeforMilliseconds1) {
            getWorkingDays(fromMilliseconds, toMilliseconds, email, typeNum, function (workingPeriod, isValid, reason, containsHolidays, overlappedVacations, body) {
                if (workingPeriod != 1000) {
                    getStartAndEndTime(body, formattedFromTime, formattedTime);

                    var workingDays = parseFloat(workingPeriod).toFixed(2);
                    if (workingDays != 0.0 || containsHolidays == true) {
                        console.log("overlappedVacations" + overlappedVacations == null)
                        if (isValid == true || (isValid == false && type == "sick") || (isValid == false && type == "Wedding") || (isValid == false && type == "Paternity")) {

                            var fromDateServer = new Date(body.timeSlotFrom.date)
                            fromDateServer.setHours(body.timeSlotFrom.hour)
                            fromDateServer.setMinutes(body.timeSlotFrom.minute)
                            //
                            var toDateWordServer = new Date(body.toTimeSlot.date)
                            toDateWordServer.setHours(body.toTimeSlot.hour)
                            toDateWordServer.setMinutes(body.toTimeSlot.minute)

                            env.dateHelper.converDateToWords(fromDateServer, toDateWordServer, 0, function (wordFromDate, wordTodate) {


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
        env.toffyHelper.getIdFromEmail(email, function (Id) {
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
                    'Cookie': env.toffyHelper.general_remember_me + ";" + env.toffyHelper.general_session_id
                },
                body: vacationBody
                //Set the body as a stringcc
            }, function (error, response, body) {

                //console.log(" (JSON.parse(body)).validRequest.reason" + (JSON.parse(body)).validRequest.reason)
                if (response.statusCode == 500) {
                    callback(1000, "no ")
                } else if (response.statusCode == 400)
                    callback(1000, "no ")
                else if ((JSON.parse(body)).validRequest.overlappedVacations) {
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




        messageText = typeText + " from  " + fromDate + " to " + ToDate + " and that would be " + workingDays + " working days. " + overlppedMsg + ". Should I go ahead ?"


        if (timeOffcase == 8) {
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
                messageText = typeText + " on " + fromDate + " to " + ToDate + " and that would be " + workingDays + " working day. " + overlppedMsg + " Should I go ahead ? "


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
            env.dateHelper.converDateToWords(overlappedVacations[i].fromDate, overlappedVacations[i].toDate, 0, function (fromDateWord, toDateWord) {
                overlppedMsg = overlppedMsg + " from " + fromDateWord + " to " + toDateWord
            })

            i++;
        }
        console.log("overlppedMsg::" + overlppedMsg)
        overlppedMsg = "\n[Note]: There is an already taken time off " + overlppedMsg + " and it will be overwritten when you press \"Yes\"."
        callback(overlppedMsg)
    } else callback(overlppedMsg)

}
