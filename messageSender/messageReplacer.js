const request = require('request');
var toffyHelper = require('.././toffyHelper.js')
var server = require('.././server.js')
var sessionFlag = 0;
var IP = process.env.SLACK_IP
module.exports.replaceWithComment = function replaceWithComment(msg, fromTime, toTime, email, fromMilliseconds, toMilliseconds, type, workingDays, wordFromDate, wordTodate, messageText) {

    var dont_detuct_button = ""

    var messageBody = {
        "text": "",
        "attachments": [
            {
                "text": messageText + "\n ( Note: Any official holiday will not be deducted from your time off request.)",
                "callback_id": 'leave_with_vacation_confirm_reject',
                "color": "#3AA3E3",
                "attachment_type": "default",
                "actions": [
                    {
                        "name": 'confirm',
                        "text": "Training",
                        "style": "primary",
                        "type": "button",
                        "value": fromTime + ";" + toTime + ";" + email + ";" + fromMilliseconds + ";" + toMilliseconds + ";" + type + ";" + workingDays + ";" + wordFromDate + ";" + wordTodate + ";" + messageText
                    },
                    {
                        "name": 'reject',
                        "text": "Training",
                        "style": "danger",
                        "type": "button",
                        "value": fromTime + ";" + toTime + ";" + email + ";" + fromMilliseconds + ";" + toMilliseconds + ";" + type + ";" + workingDays + ";" + wordFromDate + ";" + wordTodate + ";" + messageText
                    },
                    {
                        "name": 'yesWithComment',
                        "text": "University",
                        "style": "danger",
                        "type": "button",
                        "value": fromTime + ";" + toTime + ";" + email + ";" + fromMilliseconds + ";" + toMilliseconds + ";" + type + ";" + workingDays + ";" + wordFromDate + ";" + wordTodate + ";" + messageText
                    },
                    {
                        "name": 'yesWithComment',
                        "text": "Personal",
                        "style": "danger",
                        "type": "button",
                        "value": fromTime + "," + toTime + "," + email + "," + fromMilliseconds + "," + toMilliseconds + "," + type + "," + workingDays + "," + wordFromDate + "," + wordTodate + "," + messageText
                    }
                    ,
                    {
                        "name": 'yesWithComment',
                        "text": "Honeymoon",
                        "style": "danger",
                        "type": "button",
                        "value": fromTime + "," + toTime + "," + email + "," + fromMilliseconds + "," + toMilliseconds + "," + type + "," + workingDays + "," + wordFromDate + "," + wordTodate + "," + messageText
                    }
                    ,
                    {
                        "name": 'yesWithComment',
                        "text": "Umrah",
                        "style": "danger",
                        "type": "button",
                        "value": fromTime + "," + toTime + "," + email + "," + fromMilliseconds + "," + toMilliseconds + "," + type + "," + workingDays + "," + wordFromDate + "," + wordTodate + "," + messageText
                    }



                ],
                "color": "#F35A00",

            }
        ]
    }
    msg.respond(msg.body.response_url, messageBody)
}