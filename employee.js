var requestify = require('requestify');
const request = require('request');
var server = require('./server')
var generalCookies = "initial"
var IP = process.env.SLACK_IP
var userIdInHr = "initial";
exports.userIdInHr = userIdInHr
var toffyHelper = require('./toffyHelper')
var sessionFlag = 0;
var async = require('async');
var currentBot = server.bot;
var hrRole = 0;


module.exports.showEmployeeHistory = function showEmployeeHistory(email, msg) {

    printLogs("Show employee history")
    printLogs("email::" + email)

    request({
        url: 'http://' + IP + '/api/v1/employee/8/vacations/2017',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': generalCookies
        },
    }, function (error, response, body) {
        if (response.statusCode == 403) {
            sessionFlag = 0
        }
        toffyHelper.getNewSession(email, function (cookie) {
            var uri = 'http://' + IP + '/api/v1/employee/8/vacations/2017'
            printLogs("URI" + uri)
            generalCookies = cookie;
            request({
                url: uri,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': generalCookies
                },
            }, function (error, response, body) {
                printLogs("========>" + response.statusCode);
                var i = 0;
                printLogs("history::" + JSON.stringify(body))
                //check if no holidays ,so empty response
                if (!error && response.statusCode === 200) {
                    if (!(JSON.parse(body)[i])) {
                        msg.say("There are no holidays, sorry!");
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
                                "text": "Vacation number" + i + ":",
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
function printLogs(msg) {
    console.log("msg:========>:" + msg)
}