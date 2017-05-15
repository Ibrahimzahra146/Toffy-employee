/**
 * 
 */
module.exports.helpMessageBody = function helpMessageBody(fields, actions, pretext) {
    var messageBody = {
        "text": "",
        "callback_id": 'preDefinedHelp',
        "attachment_type": "default",
        "attachments": [
            {

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
        "name": 'Show_stats',
        "text": "Show stats",
        // "style": "primary",
        "type": "button",
        "value": ""
    }, {
        "name": 'Show_profile',
        "text": "Show profile",
        // "style": "primary",
        "type": "button",
        "value": ""
    },
    {
        "name": 'Show_history',
        "text": "Show history",
        //"style": "primary",
        "type": "button",
        "value": ""
    }
]
exports.statsProfileHistoryActions = statsProfileHistoryActions
/**
 * Time off help menu
 */
var timeOffPredefinedActions = [
    {
        "name": 'time_off_today',
        "text": "Time off today",
        // "style": "primary",
        "type": "button",
        "value": ""
    }, {
        "name": 'time_off_tomorrow',
        "text": "Time off tomorrow",
        // "style": "primary",
        "type": "button",
        "value": ""
    },
    {
        "name": 'sick_today',
        "text": "I am sick today",
        //"style": "primary",
        "type": "button",
        "value": ""
    }
    ,
    {
        "name": 'sick_tomorrow',
        "text": "I am sick tomorrow",
        //"style": "primary",
        "type": "button",
        "value": ""
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
        "name": "Wfh_today",
        "text": "WFH today",
        // "style": "primary",
        "type": "button",
        "value": ""
    }, {
        "name": 'Wfh_tomorrow',
        "text": "WFH tomorrow",
        // "style": "primary",
        "type": "button",
        "value": ""
    }

]
exports.WfhActions = WfhActions
var FamilyDeathActions = [
    {
        "name": "death_today",
        "text": "Family death today",
        // "style": "primary",
        "type": "button",
        "value": ""
    }, {
        "name": 'death_yesterday',
        "text": "Family death yesterday",
        // "style": "primary",
        "type": "button",
        "value": ""
    }

]
exports.FamilyDeathActions = FamilyDeathActions;
/**
 * 
 */
var holidayAction = [
    {
        "name": "show_holidays",
        "text": "Show holidays",
        // "style": "primary",
        "type": "button",
        "value": ""
    }, {
        "name": 'next_holiday',
        "text": "Show next holiday",
        // "style": "primary",
        "type": "button",
        "value": ""
    }

]
exports.holidayAction = holidayAction;
/**
 * 
 */
var rulesAction = [
    {
        "name": "show_rules",
        "text": "Submission rules",
        // "style": "primary",
        "type": "button",
        "value": ""
    },

]
module.exports.rulesAction = rulesAction
