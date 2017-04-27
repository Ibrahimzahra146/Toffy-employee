const request = require('request');
var toffyHelper = require('.././toffyHelper.js')
var server = require('.././server.js')
var sessionFlag = 0;
var IP = process.env.SLACK_IP
module.exports.replaceWithComment = function replaceWithComment(msg, userEmail, managerEmail, fromDate, toDate, type, vacationId, approvalId, ImageUrl, workingDays, messagetext) {

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
                        "name": "Send_comment",
                        "text": "Sorry",
                        "style": "danger",
                        "type": "button",
                        "value": userEmail + ";" + vacationId + ";" + approvalId + ";" + managerEmail + ";employee" + ";" + fromDate + ";" + toDate + ";" + type + ";" + workingDays + ";" + ImageUrl + ";Sorry!"
                    },
                    {
                        "name": "Send_comment",
                        "text": "Project deadline",
                        "style": "primary",
                        "type": "button",
                        "value": userEmail + ";" + vacationId + ";" + approvalId + ";" + managerEmail + ";employee" + ";" + fromDate + ";" + toDate + ";" + type + ";" + workingDays + ";" + ImageUrl + ";Project deadline"
                    },

                    {
                        "name": "Send_comment",
                        "text": "Discuss it privately",
                        "style": "primary",
                        "type": "button",
                        "value": userEmail + ";" + vacationId + ";" + approvalId + ";" + managerEmail + ";employee" + ";" + fromDate + ";" + toDate + ";" + type + ";" + workingDays + ";" + ImageUrl + ";Discuss it privately"
                    },
                    {
                        "name": "Send_comment",
                        "text": "No replaceable emp",
                        "type": "button",
                        "value": userEmail + ";" + vacationId + ";" + approvalId + ";" + managerEmail + ";employee" + ";" + fromDate + ";" + toDate + ";" + type + ";" + workingDays + ";" + ImageUrl + ";No replaceable emp"
                    }, {
                        "name": "Undo",
                        "text": "Undo",
                        "type": "button",
                        "value": userEmail + ";" + vacationId + ";" + approvalId + ";" + managerEmail + ";employee" + ";" + fromDate + ";" + toDate + ";" + type + ";" + workingDays + ";" + ImageUrl
                    }

                ],
                "color": "#F35A00",
                "thumb_url": ImageUrl,
            }
        ]
    }
    msg.respond(msg.body.response_url, messageBody)
}