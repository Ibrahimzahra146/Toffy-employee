const request = require('request');
var toffyHelper = require('.././toffyHelper.js')
var server = require('.././server.js')
var sessionFlag = 0;
var IP = process.env.SLACK_IP
module.exports.replaceWithComment = functionreplaceWithComment(msg, fromTime, toTime, email, fromMilliseconds, toMilliseconds, type, workingDays, wordFromDate, wordTodate, messageText) {

    var dont_detuct_button = ""

    var messageBody = {
        "text": "",
        "attachments": [
            {
                "text": messagetext + "\n ( Note: Any official holiday will not be deducted from your time off request.)",
                "callback_id": 'leave_with_vacation_confirm_reject',
                "color": "#3AA3E3",
                "attachment_type": "default",
                "actions": [
                    {
                        "name": 'confirm',
                        "text": "Training",
                        "style": "primary",
                        "type": "button",
                        "value": fromTime + "," + toTime + "," + email + "," + fromMilliseconds + "," + toMilliseconds + "," + type + "," + workingDays + "," + wordFromDate + "," + wordTodate + ";" + messagetext
                    },
                    {
                        "name": 'reject',
                        "text": "Training",
                        "style": "danger",
                        "type": "button",
                        "value": fromTime + "," + toTime + "," + email + "," + fromMilliseconds + "," + toMilliseconds + "," + type + "," + workingDays + "," + wordFromDate + "," + wordTodate + ";" + messagetext
                    },
                    {
                        "name": 'yesWithComment',
                        "text": "University",
                        "style": "danger",
                        "type": "button",
                        "value": fromTime + "," + toTime + "," + email + "," + fromMilliseconds + "," + toMilliseconds + "," + type + "," + workingDays + "," + wordFromDate + "," + wordTodate + "," + messagetext
                    },
                    {
                        "name": 'yesWithComment',
                        "text": "Personal",
                        "style": "danger",
                        "type": "button",
                        "value": fromTime + "," + toTime + "," + email + "," + fromMilliseconds + "," + toMilliseconds + "," + type + "," + workingDays + "," + wordFromDate + "," + wordTodate + "," + messagetext
                    }
                    ,
                    {
                        "name": 'yesWithComment',
                        "text": "Honeymoon",
                        "style": "danger",
                        "type": "button",
                        "value": fromTime + "," + toTime + "," + email + "," + fromMilliseconds + "," + toMilliseconds + "," + type + "," + workingDays + "," + wordFromDate + "," + wordTodate + "," + messagetext
                    }
                    ,
                    {
                        "name": 'yesWithComment',
                        "text": "Umrah",
                        "style": "danger",
                        "type": "button",
                        "value": fromTime + "," + toTime + "," + email + "," + fromMilliseconds + "," + toMilliseconds + "," + type + "," + workingDays + "," + wordFromDate + "," + wordTodate + "," + messagetext
                    }



                ],
                "color": "#F35A00",
                "thumb_url": ImageUrl,
            }
        ]
    }
    msg.respond(msg.body.response_url, messageBody)
}