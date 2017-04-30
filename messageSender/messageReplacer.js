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
                        "name": 'Send_Commnet',
                        "text": "Travel",
                        "style": "primary",
                        "type": "button",
                        "value": fromTime + ";" + toTime + ";" + email + ";" + fromMilliseconds + ";" + toMilliseconds + ";" + type + ";" + workingDays + ";" + wordFromDate + ";" + wordTodate + ";" + messageText + ";" + "Travel"
                    },
                    {
                        "name": 'Send_Commnet',
                        "text": "Training",
                        "style": "danger",
                        "type": "button",
                        "value": fromTime + ";" + toTime + ";" + email + ";" + fromMilliseconds + ";" + toMilliseconds + ";" + type + ";" + workingDays + ";" + wordFromDate + ";" + wordTodate + ";" + messageText + ";" + "Training"
                    },
                    {
                        "name": 'Send_Commnet',
                        "text": "University",
                        "style": "danger",
                        "type": "button",
                        "value": fromTime + ";" + toTime + ";" + email + ";" + fromMilliseconds + ";" + toMilliseconds + ";" + type + ";" + workingDays + ";" + wordFromDate + ";" + wordTodate + ";" + messageText + ";" + "University"
                    },
                    {
                        "name": 'Send_Commnet',
                        "text": "Personal",
                        "style": "danger",
                        "type": "button",
                        "value": fromTime + ";" + toTime + ";" + email + ";" + fromMilliseconds + ";" + toMilliseconds + ";" + type + ";" + workingDays + ";" + wordFromDate + ";" + wordTodate + ";" + messageText + ";" + "Personal"
                    }
                    ,
                    {
                        "name": 'Send_Commnet',
                        "text": "Honeymoon",
                        "style": "danger",
                        "type": "button",
                        "value": fromTime + "," + toTime + "," + email + "," + fromMilliseconds + "," + toMilliseconds + "," + type + "," + workingDays + "," + wordFromDate + "," + wordTodate + "," + messageText + ";" + "Honeymoon"
                    }
                    ,
                    {
                        "name": 'Send_Commnet',
                        "text": "Umrah",
                        "style": "danger",
                        "type": "button",
                        "value": fromTime + "," + toTime + "," + email + "," + fromMilliseconds + "," + toMilliseconds + "," + type + "," + workingDays + "," + wordFromDate + "," + wordTodate + "," + messageText + ";" + "Umrah"
                    }



                ],
                "color": "#F35A00",

            }
        ]
    }
    msg.respond(msg.body.response_url, messageBody)
}