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
    getComment(workingDays, type, function (comment1, comment2, comment3, comment4f) {


        var messageBody = {
            "text": "",
            "attachments": [
                {
                    "text": messageText + holidaysNotice,
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
                        },
                        {
                            "name": 'Send_Commnet',
                            "text": comment4,

                            "type": "button",
                            "value": fromTime + ";" + toTime + ";" + email + ";" + fromMilliseconds + ";" + toMilliseconds + ";" + type + ";" + workingDays + ";" + wordFromDate + ";" + wordTodate + ";" + messageText + ";" + comment4
                        },

                        {
                            "name": 'Undo',
                            "text": "back",

                            "style": "danger",
                            "type": "button",
                            "value": fromTime + ";" + toTime + ";" + email + ";" + fromMilliseconds + ";" + toMilliseconds + ";" + type + ";" + workingDays + ";" + wordFromDate + ";" + wordTodate + ";" + messageText + ";" + "Honeymoon"
                        },

                        {
                            "name": 'Send_Commnet',
                            "text": "Funeral",

                            "type": "button",
                            "value": fromTime + "," + toTime + "," + email + "," + fromMilliseconds + "," + toMilliseconds + "," + type + "," + workingDays + "," + wordFromDate + "," + wordTodate + "," + messageText + ";" + "Umrah"
                        }
                        ,
                        {
                            "name": 'Send_Commnet',
                            "text": "Family affairs",

                            "type": "button",
                            "value": fromTime + "," + toTime + "," + email + "," + fromMilliseconds + "," + toMilliseconds + "," + type + "," + workingDays + "," + wordFromDate + "," + wordTodate + "," + messageText + ";" + "Umrah"
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
    var holidaysNotice = "\n ( Note: Any official holiday will not be deducted from your time off request.)"
    if (type == "sick") {
        // msg.say("Sorry to hear that :(")
        holidaysNotice = ""
    }
    if (type == "WFH") {
        holidaysNotice = ""
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
    msg.respond(msg.body.response_url, messageBody)

}
//Get comment based on type and period
function getComment(workingDays, type, callback) {
    if (type == "sick") {
        callback("Personal", "Flu", "Common cold", "Surgery")
    } else if (workingDays < 1) {
        callback("Personal", "Something urgent", "Traffic", "Bad weather")
    } else if (workingDays >= 1 && workingDays <= 3) {
        callback("Personal", "Family illness", "University", "Travel")
    } else if (workingDays > 3) {
        callback("Personal", "Travel", "Umrah", "Honeymoon")
    }

}