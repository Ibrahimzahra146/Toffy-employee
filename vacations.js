var request = require('request')
var IP = process.env.SLACK_IP
var toffyHelper = require('./toffyHelper')


//send confirmation to emp when he request one day vacation 
module.exports.sendOneDaySickVacationConfirmationtoEmp = function sendOneDaySickVacationConfirmationtoEmp(msg, startDate, endDate, email, type) {
  var workingDays = 1;
  msg.say("Sorry to hear that :( ")
  var text12 = {
    "text": "",
    "attachments": [
      {
        "text": "Okay, you asked for 1 working day off ( " + startDate + " ). Should I go ahead ?",
        "callback_id": 'confirm_reject',
        "color": "#3AA3E3",
        "attachment_type": "default",
        "actions": [
          {
            "name": 'confirm',
            "text": "Yes",
            "style": "primary",
            "type": "button",
            "value": startDate + "," + endDate + "," + email + "," + type + "," + workingDays
          },
          {
            "name": 'reject',
            "text": "No",
            "style": "danger",
            "type": "button",
            "value": startDate + "," + endDate + "," + email + "," + type + "," + workingDays
          }
        ]
      }
    ]
  }
  msg.say(text12)
}
// send confirmation to employee when he want just one day vacation
module.exports.sendOneDayVacationConfirmationtoEmp = function sendOneDayVacationConfirmationtoEmp(msg, startDate, endDate, email, type) {
  var workingDays = 1
  var text12 = {
    "text": "",
    "attachments": [
      {
        "text": "Okay, you asked for 1 working day off ( " + startDate + " ). Should I go ahead :-) ?",
        "callback_id": 'confirm_reject',
        "color": "#3AA3E3",
        "attachment_type": "default",
        "actions": [
          {
            "name": 'confirm',
            "text": "Yes",
            "style": "primary",
            "type": "button",
            "value": startDate + "," + endDate + "," + email + "," + type + "," + workingDays
          },
          {
            "name": 'reject',
            "text": "No",
            "style": "danger",
            "type": "button",
            "value": startDate + "," + endDate + "," + email + "," + type + "," + workingDays
          }
        ]
      }
    ]
  }
  msg.say(text12)
}//****************************************************************************
// send a confirmation to user to be sure he want the vacation and enter true dates

module.exports.sendVacationConfirmationToEmp = function sendVacationConfirmationToEmp(msg, startDate, endDate, email, type) {
  getWorkingDays(startDate, endDate, email, function (body) {
    var workingDays = parseFloat(body).toFixed(1)
    var text12 = {
      "text": "",
      "attachments": [
        {
          "text": "Okay, from " + startDate + "  to  " + endDate + " that would be " + workingDays + " working days . Should I go ahead  ?",
          "callback_id": 'confirm_reject',
          "color": "#3AA3E3",
          "attachment_type": "default",
          "actions": [
            {
              "name": 'confirm',
              "text": "Yes",
              "style": "primary",
              "type": "button",
              "value": startDate + "," + endDate + "," + email + "," + type + "," + workingDays
            },
            {
              "name": 'reject',
              "text": "No",
              "style": "danger",
              "type": "button",
              "value": startDate + "," + endDate + "," + email + "," + type + "," + workingDays
            }
          ]
        }
      ]
    }

    msg.say(text12)
  })

}
function getWorkingDays(startDate, endDate, email, callback) {
  var vacationBody = {
    "from": startDate,
    "to": endDate

  }
  vacationBody = JSON.stringify(vacationBody)

  request({
    url: "http://" + IP + "/api/v1/vacation/working-days", //URL to hitDs
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': toffyHelper.generalCookies
    },
    body: vacationBody
    //Set the body as a stringcc
  }, function (error, response, body) {
    if (response.statusCode == 403) {
      toffyHelper.sessionFlag = 0;
    } toffyHelper.getNewSession(email, function (cookies) {
      toffyHelper.generalCookies = cookies
      request({
        url: "http://" + IP + "/api/v1/vacation/working-days", //URL to hitDs
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': toffyHelper.generalCookies
        },
        body: vacationBody
        //Set the body as a stringcc
      }, function (error, response, body) {
        console.log("getWorkingDays" + response.statusCode)
        console.log("getWorkingDays" + body);
        console.log("getWorkingDays" + JSON.stringify(body));
        callback(body)
      })

    })



  })

}