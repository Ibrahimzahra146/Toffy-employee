const request = require('request');
var toffyHelper = require('.././toffyHelper.js')
var server = require('.././server.js')
var sessionFlag = 0;
var generalCookies = "initial"
var IP = process.env.SLACK_IP
module.exports.sendMessageSpecEmployee = function sendMessageSpecEmployee(email, text) {
    request({
        url: 'http://' + IP + '/api/v1/toffy/get-record', //URL to hitDs
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': 'JSESSIONID=24D8D542209A0B2FF91AB2A333C8FA70'
        },
        body: email
        //Set the body as a stringcc
    }, function (error, response, body) {
        var responseBody = JSON.parse(body);

        var message = {
            'type': 'message',
            'channel': responseBody.userChannelId,
            user: responseBody.slackUserId,
            text: 'what is my name',
            ts: '1482920918.000057',
            team: responseBody.teamId,
            event: 'direct_message'
        };
        server.employeeBot.startConversation(message, function (err, convo) {
            if (!err) {
                var text12 = {
                    "text": "happy birthday man ",
                    "attachments": [
                        {
                            "attachment_type": "default",

                            "text": "",
                            "fallback": "ReferenceError",
                            "image_url": "http://68.media.tumblr.com/28c52c2891b4784e093830763fd92e48/tumblr_inline_o2195iz6PK1t8z0o6_540.gif"
                        }
                    ]
                }

                var stringfy = JSON.stringify(text12);
                var obj1 = JSON.parse(stringfy);
                server.employeeBot.reply(message, obj1);
            }
        });
    });
}