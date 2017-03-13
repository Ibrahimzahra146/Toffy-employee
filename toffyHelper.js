var requestify = require('requestify');
const request = require('request');
var server = require('./server')
var generalCookies = "initial"
var IP = process.env.SLACK_IP
var userIdInHr = "initial";
exports.userIdInHr = userIdInHr
var toffyHelper = require('./toffyHelper')
var sessionFlag = 0;
//first we start we basic cases that doesnt need Api Ai like help
module.exports.showEmployeeStats = function showEmployeeStats(email, msg) {
    console.log("show emoloyee stats -0")

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
        console.log("------------------>" + userIdInHr)

        toffyHelper.getNewSession(email, function (cookie) {
            generalCookies = cookie
            console.log("+ toffyHelper.user IdInHr + " + toffyHelper.userIdInHr)
            request({
                url: "http://" + IP + "/api/v1/employee/" + toffyHelper.userIdInHr + "/balance",
                json: true,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': generalCookies
                }
            }, function (error, response, body) {
                console.log("arrivvee--->" + body.left_over)
                console.log(body)
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
                                    "title": "Available time off  ",
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
            console.log("show profile bod" + toffyHelper.userIdInHr)

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
                console.log("show profile bod" + JSON.stringify(body))
                console.log("show profile bod" + response.statusCode)
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


    console.log("===============>store user information")
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
        console.log("========>error " + error);
        console.log("========>Response  " + response);
        console.log("========>body " + body);
        console.log("========>Session " + generalCookies);
        console.log("========>userIdInHr " + userIdInHr);
        console.log("========>response.statusCode :" + response.statusCode)

        //check if the session is expired  so we request a new session 
        if ((response.statusCode == 403) || (generalCookies == "initial") || (userIdInHr == "initial")) {
            console.log("response:403");
            toffyHelper.getNewSession(email, function (cookies) {

                generalCookies = cookies



            })

        }
        //if the user exist but may be added or not at toffy record
        else {
            console.log("the session ID:" + generalCookies)
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
                console.log("response:404");

                if (response.statusCode == 404) {
                    console.log("the employee not found ")

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
                    console.log("=====>arrive5 ")
                    console.log((JSON.parse(body)).managerChannelId)
                    console.log(msg.body.event.channel)
                    if (((JSON.parse(body)).userChannelId) != (msg.body.event.channel)) {
                        console.log("=====>arrive6")

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
                            console.log("DELETEd");

                        });
                        console.log("=====>arrive3")
                        requestify.post("http://" + IP + "/api/v1/toffy", {
                            "email": email,
                            "hrChannelId": hrChId,
                            "managerChannelId": managerChId,
                            "slackUserId": msg.body.event.user,
                            "teamId": msg.body.team_id,
                            "userChannelId": msg.body.event.channel
                        })
                            .then(function (response) {
                                console.log("=====>arrive4")

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
//Send sick vacation request to Hr to confirm or reject
module.exports.sendVacationToHr = function sendVacationToHr(startDate, endDate, userEmail, type) {
    request({
        url: 'http://' + IP + '/api/v1/toffy/get-record', //URL to hitDs
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': 'JSESSIONID=24D8D542209A0B2FF91AB2A333C8FA70'
        },
        body: userEmail
        //Set the body as a stringcc
    }, function (error, response, body) {
        if (response.stat)
            var jsonResponse = JSON.parse(body);
        var hRmessage = {
            'type': 'message',
            'channel': jsonResponse.hrChannelId,
            user: jsonResponse.slackUserId,
            text: 'what is my name',
            ts: '1482920918.000057',
            team: jsonResponse.teamId,
            event: 'direct_message'
        };
        var messageBody = {
            "text": "This folk has pending sick time off request:",
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
                            "value": userEmail
                        },
                        {
                            "name": "reject",
                            "text": "Reject",
                            "style": "danger",
                            "type": "button",
                            "value": userEmail
                        }, {
                            "name": "dontDetuct",
                            "text": "Don’t Deduct ",
                            "type": "button",
                            "value": userEmail
                        }
                    ],
                    "color": "#F35A00"
                }
            ]
        }
        server.hRbot.startConversation(hRmessage, function (err, convo) {


            if (!err) {

                var stringfy = JSON.stringify(messageBody);
                var obj1 = JSON.parse(stringfy);
                server.hRbot.reply(hRmessage, obj1);

            }
        });
    });
}
//*************************************************************************************************
//send vacation notification to the managers to approve or reject
module.exports.sendVacationToManager = function sendVacationToManager(startDate, endDate, userEmail, type, vacationId, managerApproval) {
    console.log("toffyHelper.userIdInHr===========>" + userIdInHr)
    toffyHelper.getUserManagers(toffyHelper.userIdInHr, userEmail, managerApproval, function (body) {
        var approvalId = ""
        var managerEmail = ""
        //get the email of manager approval from user managers  ,the priority fro manager approval
        var i = 0
        var j = 0
        approvalId = managerApproval[i].id
        while (managerApproval[i]) {
            while (body[j]) {//body is the managers for the user
                console.log("i----->" + i)

                if (body[j].id == managerApproval[i].manager) {
                    managerEmail = body[i].email;

                    console.log("userEmail--------=======>>>>" + userEmail)
                    console.log("arrive to send coonfirmation");
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
                        var jsonResponse = JSON.parse(body);
                        var message = {
                            'type': 'message',

                            'channel': jsonResponse.managerChannelId,
                            user: jsonResponse.slackUserId,
                            text: 'what is my name',
                            ts: '1482920918.000057',
                            team: jsonResponse.teamId,
                            event: 'direct_message'
                        };
                        console.log("approval id" + approvalId)
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
                        server.bot.startConversation(message, function (err, convo) {


                            if (!err) {

                                var stringfy = JSON.stringify(messageBody);
                                var obj1 = JSON.parse(stringfy);
                                server.bot.reply(message, obj1);

                            }
                        });
                    });
                }

                j++;
            }

            i++;
        }

    })



}
//list all holidays with range period
module.exports.showHolidays = function showHolidays(msg, email, date, date1) {
    console.log("===========>I am in show holidays  ")

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
            console.log("URI" + uri)
            generalCookies = cookie;
            request({
                url: uri,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': generalCookies
                },
            }, function (error, response, body) {
                console.log("========>" + response.statusCode);
                console.log("Response========>" + JSON.stringify(body));
                var i = 0;
                var stringMessage = "["
                if (!error && response.statusCode === 200) {
                    while ((JSON.parse(body)[i])) {

                        if (i > 0) {
                            console.log("yes true")
                            stringMessage = stringMessage + ","
                            console.log("i inside if" + i)
                            console.log("i inside if" + stringMessage)

                        }
                        stringMessage = stringMessage + "{" + "\"title\":" + "\"" + (JSON.parse(body))[i].comments + "\"" + ",\"value\":" + "\"" + (JSON.parse(body))[i].fromDate + "\"" + ",\"short\":true}"

                        console.log("string" + i)

                        i++;


                    }
                    stringMessage = stringMessage + "]"
                    console.log("stringMessage---> " + stringMessage)
                    var messageBody = {
                        "text": "Your profile details",
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
                    var stringfy = JSON.stringify(messageBody);
                    var obj1 = JSON.parse(stringfy);
                    msg.say(obj1)
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
    console.log("email ------->" + email)

    if (sessionFlag == 1) {
        res = generalCookies
        callback(res)

    } else {
        console.log("========>Getting new sessio IDaaa")
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
            console.log("Arrive 2334")
            toffyHelper.userIdInHr = (JSON.parse(body)).id;
            console.log("userIdInHr ====>>>" + userIdInHr);

            var cookies = JSON.stringify((response.headers["set-cookie"])[0]);
            console.log("cookies==================>" + cookies)
            var arr = cookies.toString().split(";")
            console.log("trim based on ;==========>" + arr[0])
            res = arr[0].replace(/['"]+/g, '');
            console.log("final session is =========>" + res)
            sessionFlag = 1;
            callback(res);
        });
    }
}
/*
function getUserId(email) {
    toffyHelper.getNewSession(email, function (cookies) {

        generalCookies = cookies
        console.log("generalCookies=======> " + generalCookies)
        console.log("==========>Getting user id from Hr")
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
            console.log("=======>body: " + body)
            userIdInHr = JSON.parse(body);
            console.log("====>user id:" + userIdInHr)

        })
    });


}
*/
module.exports.getUserManagers = function getUserManagers(userId, email, managerApproval, callback) {
    console.log("info:=======>Getting user manager")
    console.log("info:=======>User ID" + userId)
    console.log("generalCookies=========>" + generalCookies)

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
                    console.log("JSON.stringify(body)------------>>>>>" + JSON.stringify(body))
                })

            })
            callback(body)
        }
        else {
            console.log("correct" + response.statusCode)
            console.log("JSON.stringify(body)------------>>>>>" + JSON.stringify(body))
            callback(body);

        }

        // console.log("JSON.parse(body)====>" + JSON.parse(body));

    });

}
module.exports.sendVacationPostRequest = function sendVacationPostRequest(from, to, employee_id, type, callback) {
    console.log("arrive at va")
    console.log("from" + from);
    console.log("to======>" + to);
    console.log("employee_id======>" + toffyHelper.userIdInHr);
    console.log("type======>" + type);


    var vacationBody = {
        "employee_id": toffyHelper.userIdInHr,
        "from": from,
        "to": to,
        "type": "0",
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
                console.log("the vacation have been posted" + response.statusCode)
                var vacationId = (JSON.parse(body)).id;
                var managerApproval = (JSON.parse(body)).managerApproval
                console.log("Vacaction ID---->" + (JSON.parse(body)).id)
                console.log("managerApproval --->" + managerApproval)
                callback(vacationId, managerApproval);

            })
        })








    });
}

