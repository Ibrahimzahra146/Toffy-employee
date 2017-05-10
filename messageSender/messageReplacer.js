const request = require('request');
var toffyHelper = require('.././toffyHelper.js')
var server = require('.././server.js')
var sessionFlag = 0;
var IP = process.env.SLACK_IP
module.exports.replaceWithComment = function replaceWithComment(msg, fromTime, toTime, email, fromMilliseconds, toMilliseconds, type, workingDays, wordFromDate, wordTodate, messageText) {
    var holidaysNotice = "\n ( Note: Any official holiday will not be deducted from your time off request.)"
    if (type == "sick") {
        // msg.say("Sorry to hear that :(")
        holidaysNotice = ""
    }
    if (type == "WFH") {
        holidaysNotice = ""
    }
    var dont_detuct_button = ""
    getComment(workingDays, type, function (comment1, comment2, comment3, comment4) {
        var comment4Button = ""
        if (comment4 != "") {
            comment4Button = {
                "name": 'Send_Commnet',
                "text": comment4,

                "type": "button",
                "value": fromTime + ";" + toTime + ";" + email + ";" + fromMilliseconds + ";" + toMilliseconds + ";" + type + ";" + workingDays + ";" + wordFromDate + ";" + wordTodate + ";" + messageText + ";" + comment4
            }
        }

        var messageBody = {
            "text": "",
            "attachments": [
                {
                    "text": messageText,
                    "callback_id": 'leave_with_vacation_confirm_reject',
                    "color": "#3AA3E3",
                    "attachment_type": "default",
                    "actions": [
                        {
                            "name": 'Send_Commnet',
                            "text": comment1,

                            "type": "button",
                            "value": fromTime + ";" + toTime + ";" + email + ";" + fromMilliseconds + ";" + toMilliseconds + ";" + type + ";" + workingDays + ";" + wordFromDate + ";" + wordTodate + ";" + messageText + ";" + comment1
                        },
                        {
                            "name": 'Send_Commnet',
                            "text": comment2,

                            "type": "button",
                            "value": fromTime + ";" + toTime + ";" + email + ";" + fromMilliseconds + ";" + toMilliseconds + ";" + type + ";" + workingDays + ";" + wordFromDate + ";" + wordTodate + ";" + messageText + ";" + comment2
                        },



                        {
                            "name": 'Send_Commnet',
                            "text": comment3,

                            "type": "button",
                            "value": fromTime + ";" + toTime + ";" + email + ";" + fromMilliseconds + ";" + toMilliseconds + ";" + type + ";" + workingDays + ";" + wordFromDate + ";" + wordTodate + ";" + messageText + ";" + comment3
                        }, comment4Button,


                        {
                            "name": 'Undo',
                            "text": "back",

                            "style": "danger",
                            "type": "button",
                            "value": fromTime + ";" + toTime + ";" + email + ";" + fromMilliseconds + ";" + toMilliseconds + ";" + type + ";" + workingDays + ";" + wordFromDate + ";" + wordTodate + ";" + messageText + ";" + "Honeymoon"
                        }



                    ],
                    "color": "#F35A00",

                }
            ]
        }
        msg.respond(msg.body.response_url, messageBody)
    })
}
//Undo in the employee side 
module.exports.undoUserComment = function undoUserComment(msg, fromTime, toTime, email, fromMilliseconds, toMilliseconds, type, workingDays, wordFromDate, wordTodate, messagetext) {
    var addCommnetButton = ""
    var holidaysNotice = "\n ( Note: Any official holiday will not be deducted from your time off request.)"
    if (type == "sick") {
        // msg.say("Sorry to hear that :(")
        holidaysNotice = ""
    }
    if (type == "WFH") {
        holidaysNotice = ""
    }
    if (type == "sick" || type == "personal") {
        addCommnetButton = {
            "name": 'yesWithComment',
            "text": "Add comment",
            "type": "button",
            "value": fromTime + ";" + toTime + ";" + email + ";" + fromMilliseconds + ";" + toMilliseconds + ";" + type + ";" + workingDays + ";" + wordFromDate + ";" + wordTodate + ";" + messagetext
        }
    }
    var messageBody = {
        "text": "",
        "attachments": [
            {
                "text": messagetext + holidaysNotice,
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
                    addCommnetButton
                ],
            }
        ]
    }
    msg.respond(msg.body.response_url, messageBody)

}
//Get comment based on type and period
function getComment(workingDays, type, callback) {
    if (type == "sick") {
        callback("Personal", "Flu", "Common cold", "Surgery")
    } else if (workingDays <= 1) {
        callback("Personal", "Family emergency", "University", "")
    } else if (workingDays > 1 && workingDays <= 3) {
        callback("Personal", "Family illness", "Travel", "")
    } else if (workingDays > 3) {
        callback("Personal", "Travel", "Umrah", "Honeymoon")
    }

}