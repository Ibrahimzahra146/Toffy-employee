/**
 * 
 */
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
            "title": "Time off or vacation from 3 may to 5 may ",
            "value": "",
            "short": false
        },


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
        },
        {
            "title": "Tutorial video https://www.screencast.com/t/pPR0xftK",
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
