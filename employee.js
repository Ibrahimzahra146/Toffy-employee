const env = require('./Public/configrations.js')
var requestify = require('requestify');
var generalCookies = "initial"
exports.generalCookies = generalCookies;
var userIdInHr = "initial";
exports.userIdInHr = userIdInHr


/****** 
Show employee vacation history
******/

module.exports.showEmployeeHistory = function showEmployeeHistory(email, msg) {

    env.toffyHelper.getIdFromEmail(email, function (Id) {
        env.mRequests.getEmployeeHistory(Id, function (error, response, body) {
            var i = 0;
            //check if no holidays ,so empty response
            if (!error && response.statusCode === 200) {
                if (!(JSON.parse(body)[i])) {
                    msg.say("There are no requested vacations for you");
                }
                else {
                    //build message Json result to send it to slack
                    while ((JSON.parse(body)[i])) {
                        var stringMessage = "["
                        var fromDate = new Date((JSON.parse(body))[i].fromDate);
                        env.dateHelper.converDateToWords((JSON.parse(body))[i].fromDate, (JSON.parse(body))[i].toDate, 0, function (fromDateWord, toDateWord) {

                            var fromDate = fromDateWord
                            var toDate = toDateWord
                            stringMessage = stringMessage + "{" + "\"title\":" + "\"" + "From date" + "\"" + ",\"value\":" + "\"" + fromDate + "\"" + ",\"short\":true}"
                            stringMessage = stringMessage + ","
                            stringMessage = stringMessage + "{" + "\"title\":" + "\"" + "To date" + "\"" + ",\"value\":" + "\"" + toDate + "\"" + ",\"short\":true}"
                            stringMessage = stringMessage + ","
                            stringMessage = stringMessage + "{" + "\"title\":" + "\"" + "Vacation state" + "\"" + ",\"value\":" + "\"" + (JSON.parse(body))[i].vacationState + "\"" + ",\"short\":true}"
                            var typeOfVacation = ""
                            if ((JSON.parse(body))[i].type == 0)
                                typeOfVacation = "Time off"
                            else if ((JSON.parse(body))[i].type == 4)
                                typeOfVacation = "Sick time off"
                            stringMessage = stringMessage + "]"
                            var messageBody = {
                                "text": "*" + typeOfVacation + "*",
                                "attachments": [
                                    {
                                        "attachment_type": "default",
                                        "text": " ",
                                        "fallback": "ReferenceError",
                                        "fields": stringMessage,
                                        "color": "#F35A00"
                                    }
                                ]
                            }
                            printLogs("messageBody" + messageBody)
                            var stringfy = JSON.stringify(messageBody);

                            printLogs("stringfy " + stringfy)
                            stringfy = stringfy.replace(/\\/g, "")
                            stringfy = stringfy.replace(/]\"/, "]")
                            stringfy = stringfy.replace(/\"\[/, "[")
                            stringfy = JSON.parse(stringfy)

                            msg.say(stringfy)
                            i++;
                        })
                    }

                }
            }
        })

    })
}
/***** 
Show Employee stats like annual vacation and etc..
*****/
module.exports.showEmployeeStats = function showEmployeeStats(email, msg) {

    env.toffyHelper.getIdFromEmail(email, function (Id) {
        env.mRequests.getEmployeeBalance(Id, function (error, response, body) {
            var messageBody = {
                "text": "Your stats and anuual time off details",
                "attachments": [
                    {
                        "attachment_type": "default",
                        "text": " ",
                        "fallback": "ReferenceError",
                        "fields": [
                            {
                                "title": "Rolled over",
                                "value": parseFloat((body).left_over).toFixed(2) + " weeks  ( " + parseFloat(body.left_over_days).toFixed(2) + " day/s)",
                                "short": true
                            },
                            {
                                "title": "Used time off  ",
                                "value": parseFloat(body.consumed_vacation_balance).toFixed(2) + " weeks (" + parseFloat(body.consumed_vacation_balance_days).toFixed(2) + " day/s)",
                                "short": true
                            },
                            {
                                "title": "Annual time off ",
                                "value": parseFloat(body.deserved_vacation).toFixed(2) + " weeks (" + parseFloat(body.deserved_vacation_days).toFixed(2) + " day/s)",
                                "short": true
                            },
                            {
                                "title": "Used Sick time off  ",
                                "value": parseFloat(body.consume_sick_vacation).toFixed(2) + " weeks( " + parseFloat(body.consume_sick_vacation_days).toFixed(2) + " day/s)",
                                "short": true
                            }
                            ,
                            {
                                "title": "Extra time off  ",
                                "value": parseFloat(body.compensation_balance).toFixed(2) + " weeks ( " + parseFloat(body.compensation_balance_days).toFixed(2) + " day/s)",
                                "short": false
                            },




                            {
                                "title": "Balance",
                                "value": parseFloat(body.balance).toFixed(2) + " weeks ( " + parseFloat(body.balance_days).toFixed(2) + " day/s)",
                                "short": true
                            }
                        ],
                        "color": "#F35A00"
                    }
                ]
            }
            var stringfy = JSON.stringify(messageBody);
            var obj1 = JSON.parse(stringfy);
            msg.say(obj1);
        });
    })
}
/***** 
Show employee profile (employee basic employee)
*****/
module.exports.showEmployeeProfile = function showEmployeeProfile(email, msg) {
    var Approver2 = "---";
    env.toffyHelper.getIdFromEmail(email, function (Id) {
        env.mRequests.getEmployeeProfile(email, Id, function (error, response, body) {

            var Approver1 = ""
            if (body.manager[1]) {
                if (body.manager[0].rank == 2) {
                    Approver2 = body.manager[0].name
                    Approver1 = body.manager[1].name
                } else {
                    Approver2 = body.manager[1].name
                    Approver1 = body.manager[0].name
                }

                // Approver2 = body.manager[1].name;

            } else Approver1 = body.manager[0].name

            var imageUrl = body.profilePicture.replace(/ /, "%20")
            var messageBody = {
                "text": "Your profile details",
                "attachments": [
                    {
                        "attachment_type": "default",
                        "text": " ",
                        "fallback": "ReferenceError",
                        "fields": [
                            {
                                "title": "Full name ",
                                "value": body.name,
                                "short": true
                            },
                            {
                                "title": "Working days  ",
                                "value": "Sun to Thu",
                                "short": true
                            },
                            {
                                "title": "Email ",
                                "value": body.email,
                                "short": true
                            },
                            {
                                "title": "Approver 1",
                                "value": Approver1,
                                "short": true
                            },


                            {
                                "title": "Hire date",
                                "value": body.hireDate,
                                "short": true
                            },
                            {
                                "title": "Approver 2",
                                "value": Approver2,
                                "short": true
                            }
                        ],
                        "color": "#F35A00",
                        thumb_url: imageUrl
                    }
                ]
            }
            var stringfy = JSON.stringify(messageBody);
            var obj1 = JSON.parse(stringfy);
            msg.say(obj1)
        });
    })

}
function printLogs(msg) {
    console.log("msg:========>:" + msg)
}
/**
 * Show time off  rules for employee from server 
 */
module.exports.ShowRules = function showEmployeeStats(email, msg) {
    env.mRequests.getTimeOffRules(email, function (error, response, body) {

        var i = 0;
        var stringMessage = "["
        if (!error && response.statusCode === 200) {
            if (!(body)[i]) {
                msg.say("There are no rules.");
            }
            else {
                //build message Json result to send it to slack
                while (body[i]) {

                    if (i > 0) {
                        stringMessage = stringMessage + ","
                    }
                    stringMessage = stringMessage + "{" + "\"title\":" + "\"" + "\"" + ",\"value\":" + "\"" + body[i] + ".\"" + ",\"short\":false}"
                    i++;



                }
                printLogs("stringMessage::" + stringMessage);

                stringMessage = stringMessage + "]"
                var messageBody = {
                    "text": "Time off submission rules:",
                    "attachments": [
                        {
                            "attachment_type": "default",
                            "text": " ",
                            "fallback": "ReferenceError",
                            "fields": stringMessage,
                            "color": "#F35A00"
                        }
                    ]
                }
                printLogs("messageBody " + messageBody)
                var stringfy = JSON.stringify(messageBody);

                printLogs("stringfy " + stringfy)
                //    stringfy = stringfy.
                stringfy = stringfy.replace(/\\/g, "")

                stringfy = stringfy.replace(/]\"/, "]")
                stringfy = stringfy.replace(/\"\[/, "[")
                stringfy = JSON.parse(stringfy)

                msg.say(stringfy)
            }
        }
    })



}
/**
 * Send help menu for employee
 */

module.exports.sendHelpOptions = function sendHelpOptions(msg, email) {

    //stringFile.timeOffPredefinedActions
    var messageBody = env.stringFile.helpMessageBody("", env.stringFile.timeOffPredefinedActions,  env.stringFile.pretext)
    var stringfy = JSON.stringify(messageBody);
    var obj1 = JSON.parse(stringfy);
    msg.say(obj1)
    //
    messageBody = env.stringFile.helpMessageBody("",  env.stringFile.statsProfileHistoryActions, "")
    stringfy = JSON.stringify(messageBody);
    obj1 = JSON.parse(stringfy);
    msg.say(obj1)
    //

    messageBody = env.stringFile.helpMessageBody("",  env.stringFile.FamilyDeathActions, "")
    stringfy = JSON.stringify(messageBody);
    obj1 = JSON.parse(stringfy);
    msg.say(obj1)
    //
    messageBody = env.stringFile.helpMessageBody("",  env.stringFile.holidayAction, "")
    stringfy = JSON.stringify(messageBody);
    obj1 = JSON.parse(stringfy);
    msg.say(obj1)
    //
    messageBody = env.stringFile.helpMessageBody("",  env.stringFile.WfhActions, "")
    stringfy = JSON.stringify(messageBody);
    obj1 = JSON.parse(stringfy);
    msg.say(obj1)
    //
    messageBody = env.stringFile.helpMessageBody("",  env.stringFile.rulesAction, "")
    stringfy = JSON.stringify(messageBody);
    obj1 = JSON.parse(stringfy);
    msg.say(obj1)
    //
    messageBody = env.stringFile.helpMessageBody("",  env.stringFile.fromDateToDate, "")
    stringfy = JSON.stringify(messageBody);
    obj1 = JSON.parse(stringfy);
    msg.say(obj1)
    //
    messageBody = env.stringFile.helpMessageBody(env.stringFile.staticHelpFields, "", "")
    stringfy = JSON.stringify(messageBody);
    obj1 = JSON.parse(stringfy);
    msg.say(obj1)







}


