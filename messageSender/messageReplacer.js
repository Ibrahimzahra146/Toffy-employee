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
                        "name": "choose_comment",
                        "text": "choose comment",
                        "type": "select",
                        "options": [
                            {
                                "name": 'Send_Commnet',
                                "text": "Travel",

                                "type": "button",
                                "value": fromTime + ";" + toTime + ";" + email + ";" + fromMilliseconds + ";" + toMilliseconds + ";" + type + ";" + workingDays + ";" + wordFromDate + ";" + wordTodate + ";" + messageText + ";" + "Travel"
                            },
                            {
                                "name": 'Send_Commnet',
                                "text": "Training",

                                "type": "button",
                                "value": fromTime + ";" + toTime + ";" + email + ";" + fromMilliseconds + ";" + toMilliseconds + ";" + type + ";" + workingDays + ";" + wordFromDate + ";" + wordTodate + ";" + messageText + ";" + "Training"
                            },
                            {
                                "name": 'Send_Commnet',
                                "text": "University",

                                "type": "button",
                                "value": fromTime + ";" + toTime + ";" + email + ";" + fromMilliseconds + ";" + toMilliseconds + ";" + type + ";" + workingDays + ";" + wordFromDate + ";" + wordTodate + ";" + messageText + ";" + "University"
                            },
                            {
                                "name": 'Send_Commnet',
                                "text": "Personal",

                                "type": "button",
                                "value": fromTime + ";" + toTime + ";" + email + ";" + fromMilliseconds + ";" + toMilliseconds + ";" + type + ";" + workingDays + ";" + wordFromDate + ";" + wordTodate + ";" + messageText + ";" + "Personal"
                            }
                            ,
                            {
                                "name": 'Send_Commnet',
                                "text": "Honeymoon",

                                "type": "button",
                                "value": fromTime + "," + toTime + "," + email + "," + fromMilliseconds + "," + toMilliseconds + "," + type + "," + workingDays + "," + wordFromDate + "," + wordTodate + "," + messageText + ";" + "Honeymoon"
                            }
                            ,
                            {
                                "name": 'Send_Commnet',
                                "text": "Umrah",

                                "type": "button",
                                "value": fromTime + "," + toTime + "," + email + "," + fromMilliseconds + "," + toMilliseconds + "," + type + "," + workingDays + "," + wordFromDate + "," + wordTodate + "," + messageText + ";" + "Umrah"
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
                        ]
                    }



                ],
                "color": "#F35A00",

            }
        ]
    }
    msg.respond(msg.body.response_url, messageBody)
}