/**
 * 
 */
const stringFile = require('./strings.js')
module.exports.helpMessageBody = function helpMessageBody(fields, actions, pretext) {
    var messageBody = {
        "text": "",

        "attachments": [
            {
                "callback_id": 'preDefinedHelp',
                "attachment_type": "default",
                "pretext": pretext,
                "color": "#3AA3E3",
                "attachment_type": "default",
                "fields": fields,
                "actions": actions


            }
        ]
    }
    return messageBody;
}

var staticHelpFields =
    [




        {
            "title": "I want a maternity time off from 20 May",
            "value": "",
            "short": false
        }
        ,
        {
            "title": "Paternity time off on 10 May",
            "value": "",
            "short": false
        },
        {
            "title": "Marriage vacation on 10 May",
            "value": "",
            "short": false
        }
        ,
        {
            "title": "Haj vacation on 10 June ",
            "value": "",
            "short": false
        }
    ]

exports.staticHelpFields = staticHelpFields;
/**
 * stats profile history actions
 */
var statsProfileHistoryActions = [
    {
        "name": 'helpMenu',
        "text": "Show stats",
        // "style": "primary",
        "type": "button",
        "value": "Show stats"
    }, {
        "name": 'helpMenu',
        "text": "Show profile",
        // "style": "primary",
        "type": "button",
        "value": "Show profile"
    },
    {
        "name": 'helpMenu',
        "text": "Show history",
        //"style": "primary",
        "type": "button",
        "value": "Show history"
    }
]
exports.statsProfileHistoryActions = statsProfileHistoryActions
/**
 * Time off help menu
 */
var timeOffPredefinedActions = [
    {
        "name": 'helpMenu',
        "text": "Time off today",
        // "style": "primary",
        "type": "button",
        "value": "Time off today"
    }, {
        "name": 'helpMenu',
        "text": "Time off tomorrow",
        // "style": "primary",
        "type": "button",
        "value": "Time off tomorrow"
    },
    {
        "name": 'helpMenu',
        "text": "I am sick today",
        //"style": "primary",
        "type": "button",
        "value": "I am sick today"
    }
    ,
    {
        "name": 'helpMenu',
        "text": "I am sick tomorrow",
        //"style": "primary",
        "type": "button",
        "value": "I am sick tomorrow"
    }

]
exports.timeOffPredefinedActions = timeOffPredefinedActions
//
var pretext = "You can use on of the following expressions to engage with me:"
exports.pretext = pretext
/**
 * 
 */
var WfhActions = [
    {
        "name": "helpMenu",
        "text": "WFH today",
        // "style": "primary",
        "type": "button",
        "value": "WFH today"
    }, {
        "name": 'helpMenu',
        "text": "WFH tomorrow",
        // "style": "primary",
        "type": "button",
        "value": "WFH tomorrow"
    }

]
exports.WfhActions = WfhActions
var FamilyDeathActions = [
    {
        "name": "helpMenu",
        "text": "Family death today",
        // "style": "primary",
        "type": "button",
        "value": "Family death today"
    }, {
        "name": 'helpMenu',
        "text": "Family death yesterday",
        // "style": "primary",
        "type": "button",
        "value": "Family death yesterday"
    }

]
exports.FamilyDeathActions = FamilyDeathActions;
/**
 * 
 */
var holidayAction = [
    {
        "name": "helpMenu",
        "text": "Show holidays",
        // "style": "primary",
        "type": "button",
        "value": "Show holidays"
    }, {
        "name": 'helpMenu',
        "text": "Show next holiday",
        // "style": "primary",
        "type": "button",
        "value": "Show next holiday"
    }

]
exports.holidayAction = holidayAction;
/**
 * 
 */
var rulesAction = [
    {
        "name": "helpMenu",
        "text": "Submission rules",
        // "style": "primary",
        "type": "button",
        "value": "Submission rules"
    },

]
module.exports.rulesAction = rulesAction
var fromDateToDate = [
    {
        "name": "fromDateToDate",
        "text": "time off from/ to/",
        // "style": "primary",
        "type": "button",
        "value": "Submission rules"
    },

]
module.exports.fromDateToDate = fromDateToDate
//
//****************************************************************************************************************************************
module.exports.commentFieldInManagerMessageFunction = function commentFieldInManagerMessageFunction(comment) {
    var commentFieldInManagerMessage = {
        "title": "Comment",
        "value": comment,
        "short": true
    }
    return commentFieldInManagerMessage;
}

module.exports.dont_detuct_button_Function = function dont_detuct_button_Function(userEmail, vacationId, approvalId, managerEmail, startDate, endDate, type, workingDays, ImageUrl) {
    var dont_detuct_button = {
        "name": "dont_detuct",
        "text": "Don’t Deduct ",
        "type": "button",
        "value": userEmail + ";" + vacationId + ";" + approvalId + ";" + managerEmail + ";employee" + ";" + startDate + ";" + endDate + ";" + type + ";" + workingDays + ";" + ImageUrl
    }

    return dont_detuct_button;
}


module.exports.Slack_Channel_Function = function Slack_Channel_Function(managerChannelId, slackUserId, teamId) {
    var message12 = {
        'type': 'message',
        'channel': managerChannelId,
        user: slackUserId,
        text: 'what is my name',
        team: teamId,
        event: 'direct_message',
        as_user: true

    }
    return message12;
}

module.exports.sendVacationToManagerFunction = function sendVacationToManagerFunction(comment, ImageUrl, userEmail, startDate, workingDays, endDate, type, approver2State, vacationId, approvalId, managerEmail) {

    var dont_detuct_button = stringFile.dont_detuct_button_Function(userEmail, vacationId, approvalId, managerEmail,startDate, endDate, type, workingDays, ImageUrl);
    var commentFieldInManagerMessage = stringFile.commentFieldInManagerMessageFunction(comment);
    var messageBody = {
        "text": "This folk has pending time off request:",
        "attachments": [
            {
                "attachment_type": "default",
                "callback_id": "manager_confirm_reject",
                "text": userEmail,
                "fallback": "ReferenceError",
                "fields": [
                    {
                        "title": "From",
                        "value": startDate,
                        "short": true
                    },
                    {
                        "title": "Days/Time ",
                        "value": workingDays + " day",
                        "short": true
                    },
                    {
                        "title": "to",
                        "value": endDate,
                        "short": true
                    },
                    {
                        "title": "Type",
                        "value": type,
                        "short": true
                    }, commentFieldInManagerMessage,
                    {
                        "title": "Your action ",
                        "value": "Pending :thinking_face:",
                        "short": true
                    }
                    ,
                    {
                        "title": "Approver2 action",
                        "value": approver2State,
                        "short": true
                    },
                    {
                        "title": "Final state",
                        "value": "PendingManagerApproval :thinking_face:",
                        "short": true
                    }
                ],
                "actions": [
                    {
                        "name": "confirm",
                        "text": "Accept",
                        "style": "primary",
                        "type": "button",
                        "value": userEmail + ";" + vacationId + ";" + approvalId + ";" + managerEmail + ";employee" + ";" + startDate + ";" + endDate + ";" + type + ";" + workingDays + ";" + ImageUrl + ";" + "Pending" + ";" + "Pending" + ";" + "Pending"
                    },
                    {
                        "name": "reject",
                        "text": "Reject",
                        "style": "danger",
                        "type": "button",
                        "value": userEmail + ";" + vacationId + ";" + approvalId + ";" + managerEmail + ";employee" + ";" + startDate + ";" + endDate + ";" + type + ";" + workingDays + ";" + ImageUrl + ";" + "Pending" + ";" + "Pending" + ";" + "Pending"
                    },
                    {
                        "name": "reject_with_comment",
                        "text": "Reject with comment",
                        "style": "danger",
                        "type": "button",
                        "value": userEmail + ";" + vacationId + ";" + approvalId + ";" + managerEmail + ";employee" + ";" + startDate + ";" + endDate + ";" + type + ";" + workingDays + ";" + ImageUrl + ";" + "Pending" + ";" + "Pending" + ";" + "Pending"
                    }, dont_detuct_button,
                    {
                        "name": "check_state",
                        "text": ":arrows_counterclockwise:",

                        "type": "button",
                        "value": userEmail + ";" + vacationId + ";" + approvalId + ";" + managerEmail + ";employee" + ";" + startDate + ";" + endDate + ";" + type + ";" + workingDays + ";" + ImageUrl + ";" + "Pending" + ";" + "Pending" + ";" + "Pending"
                    },
                ],
                "color": "#F35A00",
                "thumb_url": ImageUrl,
            }
        ]
    }
    return messageBody;
} 