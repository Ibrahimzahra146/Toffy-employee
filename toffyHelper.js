var requestify = require('requestify');
const request = require('request');
var server = require('./server')
var generalCookies = ""
var IP = process.env.SLACK_IP
var userIdInHr = "";
//first we start we basic cases that doesnt need Api Ai like help
module.exports.showEmployeeStats = function showEmployeeStats(msg) {
    request({
        url: "https://hrexalt.herokuapp.com/api/v1/employee/1/balance",
        json: true
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
                            "value": parseFloat(body.left_over).toFixed(1) + " weeks ",
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
}
module.exports.showEmployeeProfile = function showEmployeeProfile(msg) {
    request({
        url: "https://hrexalt.herokuapp.com/api/v1/employee/1",
        json: true
    }, function (error, response, body) {
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
        console.log("========>error" + error);
        console.log("========>Response" + response);
        console.log("========>body" + body);
        //check if the session is expired  so we request a new session 
        if (response.statusCode == 403) {
            console.log("response:403");
            getNewSession(email, function (cookies) {
                generalCookies = cookies
               


            })

        }
        //if the user exist but may be added or not at toffy record
        else {
             getUserId(email);
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
module.exports.sendVacationToManager = function sendVacationToManager(startDate, endDate, userEmail, type) {
    console.log("arrive tosend coonfirmation");
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
        server.bot.startConversation(message, function (err, convo) {


            if (!err) {

                var stringfy = JSON.stringify(messageBody);
                var obj1 = JSON.parse(stringfy);
                server.bot.reply(message, obj1);

            }
        });
    });

}
//list all holidays with range period
module.exports.showHolidays = function showHolidays(msg, date, date1) {
    console.log("===========>I am in show holidays  ")

    request({
        url: 'http://' + IP + '/api/v1/holidays/range?from=' + date + '&to=' + date1,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': 'JSESSIONID=E3026F9CE1E0FA1705F7808D7CC76F04'
        },
    }, function (error, response, body) {

        console.log("========>" + response.statusCode);
        console.log("Response========>" + JSON.stringify(body));
        var i = 0;

        if (!error && response.statusCode === 200) {
            while ((JSON.parse(body)[i])) {
                msg.sayg((JSON.parse(body))[i].fromDate)
                i++;
            }
        }
    });
}
/*
get new session id using login api
*/
module.exports.getNewSession = function getNewSession(email, callback) {
    console.log("========>Getting new sessio ID")
    request({
        url: 'http://' + IP + '/api/v1/employee/login', //URL to hitDs
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: email
        //Set the body as a stringcc
    }, function (error, response, body) {
        var cookies = JSON.stringify((response.headers["set-cookie"])[0]);
        var arr = cookies.toString().split("=")
        arr = arr[1].toString().split(";")
        callback(arr[0]);
    });
}
function getUserId(email) {
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

}