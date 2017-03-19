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

//first we start we basic cases that doesnt need Api Ai like help
module.exports.showEmployeeStats = function showEmployeeStats(email, msg) {
    printLogs("show emoloyee stats -0")

    request({
        url: "http://" + IP + "/api/v1/employee/259/balance",
        json: true,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': generalCookies
        }
    }, function (error, response, body) {
        if (response.statusCode == 403) {
            sessionFlag = 0;
        }
        printLogs("------------------>" + userIdInHr)

        toffyHelper.getNewSession(email, function (cookie) {
            generalCookies = cookie
            printLogs("+ toffyHelper.user IdInHr + " + toffyHelper.userIdInHr)
            request({
                url: "http://" + IP + "/api/v1/employee/" + toffyHelper.userIdInHr + "/balance",
                json: true,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': generalCookies
                }
            }, function (error, response, body) {
                printLogs("arrivvee--->" + body.left_over)
                printLogs(body)
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
                                    "value": parseFloat((body).left_over).toFixed(1) + " weeks ",
                                    "short": true
                                },
                                {
                                    "title": "Used time off  ",
                                    "value": parseFloat(body.balance).toFixed(1) + " weeks ",
                                    "short": true
                                },
                                {
                                    "title": "Annual time offf ",
                                    "value": parseFloat(body.static_balance).toFixed(1) + " weeks ",
                                    "short": false
                                },
                                {
                                    "title": "Additional time off  ",
                                    "value": parseFloat(body.compensation_balance).toFixed(1) + " weeks ",
                                    "short": true
                                },
                                {
                                    "title": "Total",
                                    "value": parseFloat(body.left_over + body.compensation_balance + body.balance).toFixed(1) + " weeks ",
                                    "short": false
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
module.exports.showEmployeeProfile = function showEmployeeProfile(email, msg) {
    request({
        url: "http://" + IP + "/api/v1/employee/259",
        json: true,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': generalCookies
        }
    }, function (error, response, body) {
        if (response.statusCode == 403) {
            sessionFlag = 0;
        }

        toffyHelper.getNewSession(email, function (cookie) {
            printLogs("show profile bod" + toffyHelper.userIdInHr)

            generalCookies = cookie
            request({
                url: "http://" + IP + "/api/v1/employee/259",
                json: true,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': generalCookies
                },
            }, function (error, response, body) {
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
                                    "title": "Manager 1",
                                    "value": "tareq",
                                    "short": true
                                },

                                {
                                    "title": "Emp.type ",
                                    "value": "Full time",
                                    "short": true
                                },
                                {
                                    "title": "Manager 2",
                                    "value": "Sari",
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
    })

}
//store the user slack information in database
module.exports.storeUserSlackInformation = function storeUserSlackInformation(email, msg) {


    printLogs("===============>store user information")
    request({
        url: "http://" + IP + "/api/v1/toffy/get-record", //URL to hitDs
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': generalCookies
        },
        body: email
        //Set the body as a stringcc
    }, function (error, response, body) {
        printLogs("========>error " + error);
        printLogs("========>Response  " + response);
        printLogs("========>body " + body);
        printLogs("========>Session " + generalCookies);
        printLogs("========>userIdInHr " + userIdInHr);
        printLogs("========>response.statusCode :" + response.statusCode)

        //check if the session is expired  so we request a new session 
        if ((response.statusCode == 403) || (generalCookies == "initial") || (userIdInHr == "initial")) {
            printLogs("response:403");
            toffyHelper.getNewSession(email, function (cookies) {

                generalCookies = cookies



            })

        }
        //if the user exist but may be added or not at toffy record
        else {
            printLogs("the session ID:" + generalCookies)
            request({
                url: "http://" + IP + "/api/v1/toffy/get-record", //URL to hitDs
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': generalCookies
                },
                body: email
                //Set the body as a stringcc
            }, function (error, response, body) {
                printLogs("response:404");

                if (response.statusCode == 404) {
                    printLogs("the employee not found ")

                    requestify.post("http://" + IP + "/api/v1/toffy", {
                        "email": email,
                        "hrChannelId": "",
                        "managerChannelId": "",
                        "slackUserId": msg.body.event.user,
                        "teamId": msg.body.team_id,
                        "userChannelId": msg.body.event.channel
                    })
                        .then(function (response) {
                            // Get the response body
                            response.getBody();
                        });
                }
                else if (response.statusCode == 200) {
                    printLogs("=====>arrive5 ")
                    printLogs((JSON.parse(body)).managerChannelId)
                    printLogs(msg.body.event.channel)
                    if (((JSON.parse(body)).userChannelId) != (msg.body.event.channel)) {
                        printLogs("=====>arrive6")

                        var managerChId = JSON.parse(body).managerChannelId;
                        var hrChId = JSON.parse(body).hrChannelId;
                        request({
                            url: "http://" + IP + "/api/v1/toffy/" + JSON.parse(body).id, //URL to hitDs
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                                'Cookie': generalCookies
                            },
                            body: email
                            //Set the body as a stringcc
                        }, function (error, response, body) {
                            printLogs("DELETEd");

                        });
                        printLogs("=====>arrive3")
                        requestify.post("http://" + IP + "/api/v1/toffy", {
                            "email": email,
                            "hrChannelId": hrChId,
                            "managerChannelId": managerChId,
                            "slackUserId": msg.body.event.user,
                            "teamId": msg.body.team_id,
                            "userChannelId": msg.body.event.channel
                        })
                            .then(function (response) {
                                printLogs("=====>arrive4")

                                // Get the response body
                                response.getBody();
                            });
                    }
                }
            });
        }

    });

}
//first we start we basic cases that doesnt need Api Ai like help
module.exports.sendHelpOptions = function sendHelpOptions(msg) {
    var messageBody = {
        "text": "",
        "attachments": [
            {

                "pretext": "You can use on of the following expressions to engage with me:",
                "color": "#3AA3E3",
                "attachment_type": "default",
                "fields": [
                    {
                        "title": "Request a time off from date to date ",
                        "value": "",
                        "short": false
                    },
                    {
                        "title": "I want a vacation from data to date",
                        "value": "",
                        "short": false
                    },
                    {
                        "title": "I am sick today ",
                        "value": "",
                        "short": false
                    },
                    {
                        "title": "Show stats ",
                        "value": "",
                        "short": false
                    },
                    {
                        "title": "Show profile ",
                        "value": "",
                        "short": false
                    }
                    ,
                    {
                        "title": "Show history ",
                        "value": "",
                        "short": false
                    }
                ]
            }
        ]
    }
    var stringfy = JSON.stringify(messageBody);
    var obj1 = JSON.parse(stringfy);
    msg.say(obj1)
}

//**************************************************************************************************

//****************************************** ********************************************************
module.exports.convertTimeFormat = function convertTimeFormat(time, callback) {
    var arr = time.toString().split(":")
    var formattedTime = ""
    var midday = "pm";
    if (arr[0] == "13" || arr[0] == "01")
        formattedTime = "01:" + arr[1];
    else if (arr[0] == "14" || arr[0] == "02")
        formattedTime = "02:" + arr[1];
    else if (arr[0] == "15" || arr[0] == "03")
        formattedTime = "03:" + arr[1];
    else if (arr[0] == "16" || arr[0] == "04")
        formattedTime = "04:" + arr[1];
    else if (arr[0] == "17" || arr[0] == "05")
        formattedTime = "05:" + arr[1];
    else if (arr[0] == "20") {
        formattedTime = "08:" + arr[1];
        midday = "am"
    }
    else if (arr[0] == "21" || arr[0] == "09") {
        formattedTime = "09:" + arr[1];
        midday = "am"
    }
    else if (arr[0] == "22" || arr[0] == "10") {
        formattedTime = "10:" + arr[1];
        midday = "am"
    }
    else if (arr[0] == "23" || arr[0] == "11") {
        formattedTime = "11:" + arr[1];
        midday = "am"
    }
    else if (arr[0] == "00" || arr[0] == "12") {
        formattedTime = "12:" + arr[1];
        midday = "am"
    }
    else {
        formattedTime = arr[0] + ":" + arr[1];
        midday = "am";
    }

    callback(formattedTime, midday)
}

//*************************************************************************************************
//send vacation notification to the managers to approve or reject
module.exports.sendVacationToManager = function sendVacationToManager(startDate, endDate, userEmail, type, vacationId, managerApproval, toWho) {
    var message12 = ""
    var approvarType = ""
    var approvalId = ""
    var managerEmail = ""

    var i = 0
    var j = 0
    async.whilst(
        function () { return managerApproval[i]; },
        function (callback) {
            printLogs("i----->" + i)


            approvalId = managerApproval[i].id
            approvarType = managerApproval[i].type
            var x = getEmailById('employee/email/' + managerApproval[i].manager, function (emailFromId) {

                managerEmail = emailFromId.replace(/\"/, "")
                managerEmail = managerEmail.replace(/\"/, "")

                printLogs("arrive to send coonfirmation");
                request({
                    url: 'http://' + IP + '/api/v1/toffy/get-record', //URL to hitDs
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cookie': 'JSESSIONID=24D8D542209A0B2FF91AB2A333C8FA70'
                    },
                    body: managerEmail
                    //Set the body as a stringcc
                }, function (error, response, body) {
                    printLogs("approvalId" + approvalId)
                    printLogs("approvarType" + approvarType)
                    printLogs("managerEmail:" + managerEmail)
                    printLogs("Get recore body:" + JSON.stringify(body))
                    var jsonResponse = JSON.parse(body);

                    if (approvarType == "Manager") {
                        printLogs("Manager Role ")
                        message12 = {
                            'type': 'message',
                            'channel': jsonResponse.managerChannelId,
                            user: jsonResponse.slackUserId,
                            text: 'what is my name',
                            ts: '1482920918.000057',
                            team: jsonResponse.teamId,
                            event: 'direct_message'

                        }

                    } else {
                        printLogs("HR Role")
                        hrRole = 1
                        message12 = {
                            'type': 'message',

                            'channel': jsonResponse.hrChannelId,
                            user: jsonResponse.slackUserId,
                            text: 'what is my name',
                            ts: '1482920918.000057',
                            team: jsonResponse.teamId,
                            event: 'direct_message'
                        }

                    }
                    printLogs("approval id" + approvalId)
                    var messageBody = {
                        "text": "This folk has pending time off request:",
                        "attachments": [
                            {
                                "attachment_type": "default",
                                "callback_id": "manager_confirm_reject",
                                "text": "@ibrahim",
                                "fallback": "ReferenceError",
                                "fields": [
                                    {
                                        "title": "From",
                                        "value": startDate,
                                        "short": true
                                    },
                                    {
                                        "title": "Days/Time ",
                                        "value": "()",
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
                                    }
                                ],
                                "actions": [
                                    {
                                        "name": "confirm",
                                        "text": "Accept",
                                        "style": "primary",
                                        "type": "button",
                                        "value": userEmail + ";" + vacationId + ";" + approvalId + ";" + managerEmail
                                    },
                                    {
                                        "name": "reject",
                                        "text": "Reject",
                                        "style": "danger",
                                        "type": "button",
                                        "value": userEmail + ";" + vacationId + ";" + approvalId + ";" + managerEmail
                                    }, {
                                        "name": "dontDetuct",
                                        "text": "Don’t Deduct ",
                                        "type": "button",
                                        "value": userEmail + ";" + vacationId + ";" + approvalId + ";" + managerEmail
                                    }
                                ],
                                "color": "#F35A00"
                            }
                        ]
                    }
                    printLogs("message info " + JSON.stringify(message12))
                    if (approvarType == "Manager") {
                        currentBot = server.bot;

                    } else {
                        printLogs("HR Role ")

                        currentBot = server.hRbot
                    }
                    currentBot.startConversation(message12, function (err, convo) {


                        if (!err) {

                            var stringfy = JSON.stringify(messageBody);
                            var obj1 = JSON.parse(stringfy);
                            currentBot.reply(message12, obj1);

                        }
                    });
                    flagForWhileCallbacks = 1

                });

            })
            i++;
            console.log("I: " + i)
            setTimeout(callback, 1000);
        },
        function (err) {
            // 5 seconds have passed
        }
    );
    printLogs("JSON.stringify(managerApproval )" + JSON.stringify(managerApproval))

    //body is the managers for the user




    //get the email of manager approval from user managers  ,the priority fro manager approval






}
//list all holidays with range period
module.exports.showHolidays = function showHolidays(msg, email, date, date1) {
    printLogs("===========>I am in show holidays  ")

    request({
        url: 'http://' + IP + '/api/v1/holidays/range?from=' + date + '&to=' + date1,
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
            var uri = 'http://' + IP + '/api/v1/holidays/range?from=' + date + '&to=' + date1
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
                var stringMessage = "["
                //check if no holidays ,so empty response
                if (!error && response.statusCode === 200) {
                    if (!(JSON.parse(body)[i])) {
                        msg.say("There are no holidays, sorry!");
                    }
                    else {
                        
                        //build message Json result to send it to slack
                        while ((JSON.parse(body)[i])) {

                            if (i > 0) {
                                stringMessage = stringMessage + ","
                            }
                            stringMessage = stringMessage + "{" + "\"title\":" + "\"" + (JSON.parse(body))[i].comments + "\"" + ",\"value\":" + "\"" + (JSON.parse(body))[i].fromDate + "\"" + ",\"short\":true}"
                            i++;

                        }
                        printLogs("stringMessage::" + stringMessage);

                        stringMessage = stringMessage + "]"
                        var messageBody = {
                            "text": "The holidays are:",
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
                    }
                }
            })

        })


    });
}
/*
get new session id using login api
*/
module.exports.getNewSession = function getNewSession(email, callback) {
    var res = generalCookies
    printLogs("email ------->" + email)

    if (sessionFlag == 1) {
        res = generalCookies
        callback(res)

    } else {
        printLogs("Getting new session")
        request({
            url: 'http://' + IP + '/api/v1/employee/login', //URL to hitDs
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': generalCookies

            },
            body: email
            //Set the body as a stringcc
        }, function (error, response, body) {
            printLogs("Arrive 2334")
            toffyHelper.userIdInHr = (JSON.parse(body)).id;
            printLogs("userIdInHr ====>>>" + userIdInHr);

            var cookies = JSON.stringify((response.headers["set-cookie"])[0]);
            printLogs("cookies==================>" + cookies)
            var arr = cookies.toString().split(";")
            printLogs("trim based on ;==========>" + arr[0])
            res = arr[0].replace(/['"]+/g, '');
            printLogs("final session is =========>" + res)
            sessionFlag = 1;
            callback(res);
        });
    }
}
/*
function getUserId(email) {
    toffyHelper.getNewSession(email, function (cookies) {
 
        generalCookies = cookies
        printLogs("generalCookies=======> " + generalCookies)
        printLogs("==========>Getting user id from Hr")
        request({
            url: "http://" + IP + "/api/v1/employee/get-id", //URL to hitDs
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': generalCookies
            },
            body: email
            //Set the body as a stringcc
        }, function (error, response, body) {
            printLogs("=======>body: " + body)
            userIdInHr = JSON.parse(body);
            printLogs("====>user id:" + userIdInHr)
 
        })
    });
 
 
}
*/
module.exports.getUserManagers = function getUserManagers(userId, email, managerApproval, callback) {
    printLogs("info:=======>Getting user manager")
    printLogs("info:=======>User ID" + userId)
    printLogs("generalCookies=========>" + generalCookies)

    request({
        url: "http://" + IP + "/api/v1/employee/" + userId + "/managers",
        json: true,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': generalCookies
        },
    }, function (error, response, body) {
        if (response.statusCode == 403) {
            toffyHelper.getNewSession(email, function (cookies) {

                generalCookies = cookies

                request({
                    url: "http://" + IP + "/api/v1/employee/" + userId + "/managers",
                    json: true,
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cookie': generalCookies
                    },
                }, function (error, response, body) {
                    printLogs("JSON.stringify(body)------------>>>>>" + JSON.stringify(body))
                    callback(body)

                })

            })
        }
        else {
            printLogs("correct" + response.statusCode)
            printLogs("JSON.stringify(body)------------>>>>>" + JSON.stringify(body))
            callback(body);

        }

        // printLogs("JSON.parse(body)====>" + JSON.parse(body));

    });

}
module.exports.sendVacationPostRequest = function sendVacationPostRequest(from, to, employee_id, type, callback) {
    printLogs("arrive at va")
    printLogs("from" + from);
    printLogs("to======>" + to);
    printLogs("employee_id======>" + toffyHelper.userIdInHr);
    printLogs("type======>" + type);
    var vacationType = "0"
    if (type == "sick") {
        vacationType = "4"
    }

    var vacationBody = {
        "employee_id": toffyHelper.userIdInHr,
        "from": from,
        "to": to,
        "type": vacationType,
        "comments": "From ibrahim"

    }
    vacationBody = JSON.stringify(vacationBody)

    request({
        url: 'http://46.43.71.50:19090/api/v1/employee/profile', //URL to hitDs
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': generalCookies
        }
        //Set the body as a stringcc
    }, function (error, response, body) {
        if (response.statusCode == 403) {
            sessionFlag = 0
        }

        toffyHelper.getNewSession("brhoom200904@hotmail.com", function (cookie) {
            generalCookies = cookie
            request({
                url: 'http://46.43.71.50:19090/api/v1/vacation', //URL to hitDs
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': generalCookies
                },

                body: vacationBody
                //Set the body as a stringcc
            }, function (error, response, body) {
                printLogs("the vacation have been posted" + response.statusCode)
                var vacationId = (JSON.parse(body)).id;
                var managerApproval = (JSON.parse(body)).managerApproval
                printLogs("Vacaction ID---->" + (JSON.parse(body)).id)
                printLogs("managerApproval --->" + managerApproval)
                callback(vacationId, managerApproval);

            })
        })
    });
}
function getEmailById(Path, callback) {
    printLogs("arrive11")
    makeGetRequest(Path, function (response, body) {

        callback(body)
    })

}
function makeGetRequest(path, callback) {
    printLogs("arrive11")

    var uri = 'http://' + IP + '/api/v1/' + path
    printLogs("uri " + uri)

    request({
        url: uri, //URL to hitDs
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': generalCookies

        }
        //Set the body as a stringcc
    }, function (error, response, body) {
        printLogs("arrive13")

        printLogs("bodyyy:" + body)
        callback(response, body)
    })
}

function printLogs(msg) {
    console.log("msg:========>:" + msg)
}