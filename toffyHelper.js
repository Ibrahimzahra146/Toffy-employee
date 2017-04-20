var requestify = require('requestify');
const request = require('request');
var server = require('./server')
var IP = process.env.SLACK_IP
var userIdInHr = "initial";
exports.userIdInHr = userIdInHr
var toffyHelper = require('./toffyHelper')
var sessionFlag = 0;
exports.sessionFlag = sessionFlag;
var async = require('async');
var currentBot = server.bot;
var hrRole = 0;
var general_remember_me = "";
exports.general_remember_me = general_remember_me
general_session_id = "";
exports.general_session_id = general_session_id;



//store the user slack information in database
module.exports.storeUserSlackInformation = function storeUserSlackInformation(email, msg) {
    printLogs("Store user slack info :::")


    request({
        url: "http://" + IP + "/api/v1/toffy/get-record", //URL to hitDs
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: email
        //Set the body as a stringcc
    }, function (error, response, body) {

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
            if (((JSON.parse(body)).userChannelId) != (msg.body.event.channel)) {

                var managerChId = JSON.parse(body).managerChannelId;
                var hrChId = JSON.parse(body).hrChannelId;


                request({
                    url: "http://" + IP + "/api/v1/toffy/" + JSON.parse(body).id, //URL to hitDs
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: email
                    //Set the body as a stringcc
                }, function (error, response, body) {
                    printLogs("DELETED");

                });
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
    })



}
//if the user exist but may be added or not at toffy record




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
                    },
                    {
                        "title": "Show holidays ,or show holidays from  date to date. ",
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
module.exports.sendVacationToManager = function sendVacationToManager(startDate, endDate, userEmail, type, vacationId, managerApproval, toWho, workingDays) {
    var message12 = ""
    var approvarType = ""
    var approvalId = ""
    var managerEmail = ""
    var dont_detuct_button = ""
    if (type == "sickLeave") {
        type = "sick"
    }

    var i = 0
    var j = 0


    console.log("Mnaagers approvals ::::" + JSON.stringify(managerApproval))
    async.whilst(
        function () { return managerApproval[i]; },
        function (callback) {



            var x = toffyHelper.getEmailById('employee/email/' + managerApproval[i].manager, userEmail, function (emailFromId) {
                console.log("Arrive after get emailFromId:: " + i)

                console.log("mananger  email:::" + managerEmail);
                console.log("approvarType" + approvarType);
                approvalId = managerApproval[i].id
                approvarType = managerApproval[i].type
                managerEmail = emailFromId.replace(/\"/, "")
                managerEmail = managerEmail.replace(/\"/, "")
                console.log("Second i" + i)

                request({
                    url: 'http://' + IP + '/api/v1/toffy/get-record', //URL to hitDs
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',

                    },
                    body: managerEmail
                    //Set the body as a stringcc
                }, function (error, response, body) {

                    var jsonResponse = JSON.parse(body);
                    console.log("approvarType:::" + approvarType)
                    if (approvarType == "Manager") {
                        printLogs("Manager Role ")
                        var timeststamp = new Date().getTime()
                        console.log("timeststamp" + timeststamp)
                        message12 = {
                            'type': 'message',
                            'channel': jsonResponse.managerChannelId,
                            user: jsonResponse.slackUserId,
                            text: 'what is my name',
                            ts: timeststamp,
                            team: jsonResponse.teamId,
                            event: 'direct_message',
                            as_user: true

                        }

                    } else {
                        printLogs("HR Role")
                        hrRole = 1
                        message12 = {
                            'type': 'message',

                            'channel': jsonResponse.hrChannelId,
                            user: jsonResponse.slackUserId,
                            text: 'what is my name',
                            ts: startDate + ';' + endDate + ';' + userEmail,
                            team: jsonResponse.teamId,
                            event: 'direct_message'
                        }

                    }
                    if (type != "WFH") {
                        dont_detuct_button = {
                            "name": "dont_detuct",
                            "text": "Don’t Deduct ",
                            "type": "button",
                            "value": userEmail + ";" + vacationId + ";" + approvalId + ";" + managerEmail + ";employee" + ";" + startDate + ";" + endDate + ";" + type
                        }
                    }
                    getUserImage(userEmail, function (ImageUrl) {
                        console.log("ImageUrl" + ImageUrl)
                        console.log("ImageUrl" + JSON.stringify(ImageUrl))



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
                                        }
                                    ],
                                    "actions": [
                                        {
                                            "name": "confirm",
                                            "text": "Accept",
                                            "style": "primary",
                                            "type": "button",
                                            "value": userEmail + ";" + vacationId + ";" + approvalId + ";" + managerEmail + ";employee" + ";" + startDate + ";" + endDate + ";" + type
                                        },
                                        {
                                            "name": "reject",
                                            "text": "Reject",
                                            "style": "danger",
                                            "type": "button",
                                            "value": userEmail + ";" + vacationId + ";" + approvalId + ";" + managerEmail + ";employee" + ";" + startDate + ";" + endDate + ";" + type
                                        }, dont_detuct_button
                                    ],
                                    "color": "#F35A00",
                                    "thumb_url": ImageUrl,
                                }
                            ]
                        }
                        if (approvarType == "Manager") {
                            currentBot = server.bot;

                        } else {

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
                    i++;
                })
            })
            setTimeout(callback, 2000);

        },
        function (err) {
            // 5 seconds have passed
        }

    );
}
//list all holidays with range period
module.exports.showHolidays = function showHolidays(msg, email, date, date1, holidayRequestType, response11) {
    console.log("holidayRequestType" + holidayRequestType)

    console.log("date" + date)
    console.log("date1" + date1)
    toffyHelper.getNewSessionwithCookie(email, function (remember_me_cookie, session_Id) {
        request({
            url: 'http://' + IP + '/api/v1/holidays/range?from=' + date + '&to=' + date1,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': remember_me_cookie + ";" + session_Id
            },
        }, function (error, response, body) {

            if (!error && response.statusCode === 200) {
                console.log("Response.statuscode" + response.statusCode)
                console.log(JSON.stringify(body))
                if (!(JSON.parse(body)[0])) {
                    msg.say("There are no holidays, sorry!");
                }
                else {
                    //build message Json result to send it to slack
                    getHolidayMessage(body, holidayRequestType, response11, function (stringMessage) {


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

                        printLogs("stringfy " + stringfy)
                        stringfy = stringfy.replace(/\\/g, "")
                        stringfy = stringfy.replace(/]\"/, "]")
                        stringfy = stringfy.replace(/\"\[/, "[")
                        stringfy = JSON.parse(stringfy)

                        msg.say(stringfy)
                    })
                }
            }
        })
    })
}


module.exports.getIdFromEmail = function getIdFromEmail(email, callback) {

    toffyHelper.getNewSessionwithCookie(email, function (remember_me_cookie, sessionId) {
        toffyHelper.general_remember_me = remember_me_cookie
        toffyHelper.general_session_id = sessionId

        request({
            url: "http://" + IP + "/api/v1/employee/get-id", //URL to hitDs
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': toffyHelper.general_remember_me
            },
            body: email
            //Set the body as a stringcc
        }, function (error, response, body) {
            userIdInHr = JSON.parse(body);
            callback(body)

        })
    });



}

module.exports.getUserManagers = function getUserManagers(userId, email, managerApproval, callback) {


    toffyHelper.getNewSessionwithCookie(email, function (cookies, session_Id) {

        toffyHelper.generalCookies = cookies

        request({
            url: "http://" + IP + "/api/v1/employee/" + userId + "/managers",
            json: true,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookies + ";" + session_Id
            },
        }, function (error, response, body) {
            callback(body)

        })

    })

    // printLogs("JSON.parse(body)====>" + JSON.parse(body));
}
module.exports.sendVacationPostRequest = function sendVacationPostRequest(from, to, employee_id, email, type, callback) {
    printLogs("Sending vacation post request")
    printLogs("Email:" + email)
    printLogs("arrive at va")
    printLogs("from" + from);
    printLogs("to======>" + to);
    printLogs("employee_id======>" + toffyHelper.userIdInHr);
    printLogs("type======>" + type);
    toffyHelper.getIdFromEmail(email, function (Id) {
        console.log("::::" + "::" + email + "::" + Id)
        var vacationType = "0"
        if (type == "sick") {
            vacationType = "4"
        }

        var vacationBody = {
            "employee_id": Id,
            "from": from,
            "to": to,
            "type": vacationType,
            "comments": "From ibrahim"

        }
        vacationBody = JSON.stringify(vacationBody)
        var uri = 'http://' + IP + '/api/v1/vacation'
        printLogs("Uri " + uri)
        request({
            url: uri, //URL to hitDs
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': toffyHelper.general_remember_me + ";" + toffyHelper.general_session_id
            },

            body: vacationBody
            //Set the body as a stringcc
        }, function (error, response, body) {
            printLogs("the vacation have been posted " + response.statusCode)
            printLogs(error)
            printLogs(response.message)
            var vacationId = (JSON.parse(body)).id;
            var managerApproval = (JSON.parse(body)).managerApproval
            printLogs("Vacaction ID---->" + (JSON.parse(body)).id)
            printLogs("managerApproval --->" + managerApproval)
            printLogs("managerApproval --->" + JSON.stringify(managerApproval))
            callback(vacationId, managerApproval);

        })


    });



}
module.exports.getEmailById = function getEmailById(Path, email, callback) {
    makeGetRequest(Path, email, function (response, body) {

        callback(body)
    })

}
function makeGetRequest(path, email, callback) {
    toffyHelper.getNewSessionwithCookie(email, function (remember_me_cookie, session_Id) {
        var uri = 'http://' + IP + '/api/v1/' + path
        printLogs("uri " + uri)

        request({
            url: uri, //URL to hitDs
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': remember_me_cookie + ";" + session_Id

            }
            //Set the body as a stringcc
        }, function (error, response, body) {
            printLogs("email:" + body)
            callback(response, body)
        })

    })

}

function printLogs(msg) {
    console.log("msg:========>:" + msg)
}
function getDayNameOfDate(date, callback) {
    console.log("arrive getDayNameOfDate" + date)
    var weekday = new Array(7);
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";
    weekday[0] = "Sunday";

    var d = new Date(date);
    console.log(d);
    console.log("d.getDay() - 1]" + d.getDay())
    callback(weekday[d.getDay()]);
}
module.exports.getNewSessionwithCookie = function getNewSessionwithCookie(email, callback) {
    request({
        url: 'http://' + IP + '/api/v1/employee/login', //URL to hitDs
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: email
        //Set the body as a stringcc
    }, function (error, response, body) {
        var cookies = JSON.stringify((response.headers["set-cookie"])[1]);
        var arr = cookies.toString().split(";")
        res = arr[0].replace(/['"]+/g, '');
        var cookies1 = JSON.stringify((response.headers["set-cookie"])[0]);
        var arr1 = cookies1.toString().split(";")
        res1 = arr1[0].replace(/['"]+/g, '');
        printLogs("final session is =========>" + res)
        toffyHelper.sessionFlag = 1;
        callback(res, res1);
    });


}
//Send cancel feedback to managers()
module.exports.sendCancelationFeedBackToManagers = function sendCancelationFeedBackToManagers(fromDate, toDate, userEmail, vacationId, managerApproval) {
    var message12 = ""
    var approvarType = ""
    var approvalId = ""
    var managerEmail = ""


    var i = 0
    var j = 0


    console.log("cancel_request22 " + (JSON.parse(managerApproval))[i].manager)
    managerApproval = JSON.parse(managerApproval)
    console.log("Mnaagers approvals ::::" + managerApproval)
    console.log(JSON.stringify(managerApproval));
    console.log("ss")
    async.whilst(
        function () { return managerApproval[i]; },
        function (callback) {

            var x = toffyHelper.getEmailById('employee/email/' + managerApproval[i].manager, userEmail, function (emailFromId) {

                approvalId = managerApproval[i].id
                approvarType = managerApproval[i].type
                managerEmail = emailFromId.replace(/\"/, "")
                managerEmail = managerEmail.replace(/\"/, "")

                request({
                    url: 'http://' + IP + '/api/v1/toffy/get-record', //URL to hitDs
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',

                    },
                    body: managerEmail
                    //Set the body as a stringcc
                }, function (error, response, body) {

                    var jsonResponse = JSON.parse(body);
                    if (approvarType == "Manager") {
                        var timeststamp = new Date().getTime()
                        message12 = {
                            'type': 'message',
                            'channel': jsonResponse.managerChannelId,
                            user: jsonResponse.slackUserId,
                            text: 'what is my name',
                            ts: timeststamp,
                            team: jsonResponse.teamId,
                            event: 'direct_message',
                            as_user: true

                        }

                    } else {
                        hrRole = 1
                        message12 = {
                            'type': 'message',
                            'channel': jsonResponse.hrChannelId,
                            user: jsonResponse.slackUserId,
                            text: 'what is my name',
                            ts: startDate + ';' + endDate + ';' + userEmail,
                            team: jsonResponse.teamId,
                            event: 'direct_message'
                        }

                    }

                    if (approvarType == "Manager") {
                        currentBot = server.bot;

                    } else {

                        currentBot = server.hRbot
                    }
                    currentBot.startConversation(message12, function (err, convo) {


                        if (!err) {


                            currentBot.reply(message12, userEmail + " has canceled his time off request (" + fromDate + " - " + toDate + ")");

                        }
                    });

                });
                i++;

            })
            setTimeout(callback, 2000);

        },
        function (err) {
            // 5 seconds have passed
        }

    );
}
//Function to ckeack if any manager take an action 
module.exports.isManagersTakeAnAction = function isManagersTakeAnAction(managerApproval, callback) {
    console.log("isManagersTakeAnAction" + JSON.stringify(managerApproval));
    var flag = false
    var i = 0;

    async.whilst(
        function () { return managerApproval[i]; },
        function (callback) {
            if (managerApproval[i].state != "Pending") {
                flag = true
            }
            i++;
            setTimeout(callback, 500);

        },
        function (err) {
            callback(flag)
        });

}
function getHolidayMessage(body, holidayRequestType, response, callback) {
    var max = ""

    var i = 0;
    var stringMessage = "["
    var obj = JSON.parse(body);
    var shareInfoLen = Object.keys(obj).length;
    console.log("shareInfoLen" + shareInfoLen)

    if (holidayRequestType == 2 || holidayRequestType == 3) {
        if (holidayRequestType == 2)
            max = 1;
        else if (holidayRequestType == 3)
            max = response.result.parameters.number
        while (i < max) {
            getDayNameOfDate((JSON.parse(body))[i].fromDate, function (dayName) {
                console.log("dayName" + dayName)
                if (i > 0) {
                    stringMessage = stringMessage + ","
                }
                stringMessage = stringMessage + "{" + "\"title\":" + "\"" + (JSON.parse(body))[i].name + "\"" + ",\"value\":" + "\"" + (JSON.parse(body))[i].fromDate + " ( " + dayName + " )" + "\"" + ",\"short\":true}"
                i++;

            })

        }
    } else {
        while ((JSON.parse(body)[i])) {
            getDayNameOfDate((JSON.parse(body))[i].fromDate, function (dayName) {
                console.log("dayName" + dayName)
                if (i > 0) {
                    stringMessage = stringMessage + ","
                }
                stringMessage = stringMessage + "{" + "\"title\":" + "\"" + (JSON.parse(body))[i].name + "\"" + ",\"value\":" + "\"" + (JSON.parse(body))[i].fromDate + " ( " + dayName + " )" + "\"" + ",\"short\":true}"
                i++;

            })

        }
    }
    callback(stringMessage)
}

function getUserImage(email, callback) {

    toffyHelper.getIdFromEmail(email, function (Id) {

        var uri = 'http://' + IP + '/api/v1/employee/' + Id + '/image'
        printLogs("uri " + uri)

        request({
            url: uri, //URL to hitDs
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': toffyHelper.general_remember_me + ";" + toffyHelper.general_session_id

            }
            //Set the body as a stringcc
        }, function (error, response, body) {
            printLogs("email:" + body)
            callback(body)
        })

    })
}