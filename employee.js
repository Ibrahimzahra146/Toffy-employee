var requestify = require('requestify');
const request = require('request');
var server = require('./server')
var generalCookies = "initial"
exports.generalCookies = generalCookies;
var IP = process.env.SLACK_IP
var userIdInHr = "initial";
exports.userIdInHr = userIdInHr
var toffyHelper = require('./toffyHelper')

var async = require('async');
var currentBot = server.bot;
var hrRole = 0;
var remember_me = "initial";

/****** 
Show employee vacation history
******/
module.exports.showEmployeeHistory = function showEmployeeHistory(email, msg) {

    printLogs("Show employee history")
    printLogs("email::" + email)
    toffyHelper.getIdFromEmail(email, function (Id) {
        printLogs("Id in employee history function" + Id);

        toffyHelper.getNewSession(email, function (cookie) {
            var uri = 'http://' + IP + '/api/v1/employee/' + Id + '/vacations/2017'
            printLogs("URI" + uri)
            toffyHelper.generalCookies = cookie;
            request({
                url: uri,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': toffyHelper.generalCookies
                },
            }, function (error, response, body) {
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
                            var toDate = new Date((JSON.parse(body))[i].toDate)
                            stringMessage = stringMessage + "{" + "\"title\":" + "\"" + "From date" + "\"" + ",\"value\":" + "\"" + fromDate + "\"" + ",\"short\":true}"
                            stringMessage = stringMessage + ","
                            stringMessage = stringMessage + "{" + "\"title\":" + "\"" + "To date" + "\"" + ",\"value\":" + "\"" + toDate + "\"" + ",\"short\":true}"
                            stringMessage = stringMessage + ","
                            stringMessage = stringMessage + "{" + "\"title\":" + "\"" + "Vacation state" + "\"" + ",\"value\":" + "\"" + (JSON.parse(body))[i].vacationState + "\"" + ",\"short\":true}"

                            printLogs("stringMessage::" + stringMessage);
                            stringMessage = stringMessage + "]"
                            var messageBody = {
                                "text": "Vacation number (" + i + "):",
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

                            printLogs("stringfy" + stringfy)
                            stringfy = stringfy.replace(/\\/g, "")
                            stringfy = stringfy.replace(/]\"/, "]")
                            stringfy = stringfy.replace(/\"\[/, "[")
                            stringfy = JSON.parse(stringfy)

                            msg.say(stringfy)
                            i++;

                        }

                    }
                }
            })

        })


    });


}
/***** 
Show Employee stats like annual vacation and etc..
*****/
module.exports.showEmployeeStats = function showEmployeeStats(email, msg) {
    printLogs("showEmployeeStats")
    toffyHelper.getIdFromEmail(email, function (Id) {
        toffyHelper.getNewSession(email, function (cookie) {
            toffyHelper.generalCookies = cookie
            request({
                url: "http://" + IP + "/api/v1/employee/" + Id + "/balance",
                json: true,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': toffyHelper.generalCookies
                }
            }, function (error, response, body) {
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
                                    "value": parseFloat((body).left_over).toFixed(2) + " weeks ",
                                    "short": true
                                },
                                {
                                    "title": "Used time off  ",
                                    "value": parseFloat(body.vacation_balance).toFixed(2) + " weeks ",
                                    "short": true
                                },
                                {
                                    "title": "Annual time off ",
                                    "value": parseFloat(body.static_balance).toFixed(2) + " weeks ",
                                    "short": false
                                },
                                {
                                    "title": "Extra time off  ",
                                    "value": parseFloat(body.compensation_balance).toFixed(2) + " weeks ",
                                    "short": true
                                },
                                {
                                    "title": "Balance",
                                    "value": parseFloat(body.left_over + body.compensation_balance + body.balance).toFixed(2) + " weeks ",
                                    "short": false
                                },
                                {
                                    "title": "Used Sick time off  ",
                                    "value": parseFloat(body.sick_vacation_balance).toFixed(2) + " weeks ",
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


    })
}
/***** 
Show employee profile (employee basic employee)
*****/
module.exports.showEmployeeProfile = function showEmployeeProfile(email, msg) {
    var Approver2 = "---";
    toffyHelper.getIdFromEmail(email, function (Id) {



        console.log("2-toffyHelper.general_remember_me" + toffyHelper.general_remember_me)
        console.log("2-toffyHelper.general_session_id" + toffyHelper.general_session_id)

        
        request({
            url: "http://" + IP + "/api/v1/employee/" + Id,
            json: true,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': toffyHelper.general_remember_me + ";" + toffyHelper.general_session_id
            },
        }, function (error, response, body) {
            console.log("3-" + response.statusCode)
            if (body.manager[1]) {
                Approver2 = body.manager[1].name;

            }

            printLogs("show profile bod" + JSON.stringify(body))
            printLogs("show profile bod" + response.statusCode)
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
                                "value": body.manager[0].name,
                                "short": true
                            },

                            {
                                "title": "Emp.type ",
                                "value": body.employeeType,
                                "short": true
                            },
                            {
                                "title": "Approver 2",
                                "value": Approver2,
                                "short": true
                            },
                            {
                                "title": "Employment date",
                                "value": body.hireDate,
                                "short": true
                            }
                        ],
                        "color": "#F35A00"
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
