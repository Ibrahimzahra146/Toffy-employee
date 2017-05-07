'use strict'
var APIAI_ACCESS_TOKEN = process.env.APIAI_ACCESS_KEY
const express = require('express')
const Slapp = require('slapp')
const BeepBoopConvoStore = require('slapp-convo-beepboop')
const BeepBoopContext = require('slapp-context-beepboop')
const bodyParser = require('body-parser');
const uuid = require('node-uuid');
const request = require('request');
const JSONbig = require('json-bigint');
const async = require('async');
const apiai = require('apiai');
const APIAI_LANG = 'en';
const opn = require('opn');
var sessionId = uuid.v1();
var db = require('node-localdb');
var requestify = require('requestify');
var pg = require('pg');
var userdb = db('./userDetails1.json')
var Constants = require('./Constants.js');
var fs = require('fs');
var leave = require('./leave')
var vacation = require('./vacations')
var toffyHelper = require('./toffyHelper')
var employee = require('./employee.js');
const vacationWithLeave = require('./VacationEngine/VacationWithLeave.js')
const messageSender = require('./messageSender/messageSender.js')
const messageReplacer = require('./messageSender/messageReplacer.js')
const dateHelper = require('./DateEngine/DateHelper.js')
var apiAiService = apiai(APIAI_ACCESS_TOKEN);
var IP = process.env.SLACK_IP;
var APIAI_ACCESS_TOKEN = process.env.APIAI_ACCESS_KEY;
var SLACK_ACCESS_TOKEN = process.env.SLACK_APP_ACCESS_KEY;
var SLACK_BOT_TOKEN = process.env.SLACK_BOT_ACCESS_KEY;
var SLACK_HR_TOKEN = process.env.SLACK_HR_ACCESS_KEY;
var SLACK_EMPLOYEE_BOT_ACCESS_KEY = process.env.SLACK_EMPLOYEE_BOT_ACCESS_KEY
var sickFlag = "";
var userId = "U3FNW74JD"
var managerChannel = "D3RR2RE68"
var typeOfVacation = "";
var fromDate = ""
var toDate = "";
var state = "init"
var session = "";
var token = "";
var generalId = "";
var generalMsg = "";
var salesforceCode = "";
var leaveFlag = "";
var count = 0;

exports.count = count;
pg.defaults.ssl = true;

if (!process.env.PORT) throw Error('PORT missing but required')
var slapp = Slapp({
  convo_store: BeepBoopConvoStore(),
  context: BeepBoopContext()
})
var Botkit = require('./lib/Botkit.js');
var controller = Botkit.slackbot({
  debug: true,
});
var controller1 = Botkit.slackbot({
  debug: true,
});
var bot = controller.spawn({
  token: SLACK_BOT_TOKEN

}).startRTM();
exports.bot = bot
var hRbot = controller1.spawn({
  token: SLACK_HR_TOKEN

}).startRTM();
exports.hRbot = hRbot;
//
var controller2 = Botkit.slackbot({
  debug: true,
});
var employeeBot = controller2.spawn({
  token: SLACK_EMPLOYEE_BOT_ACCESS_KEY

}).startRTM();
exports.employeeBot = employeeBot


/**
 * 
 */
function SendWelcomeResponse(msg, responseText) {

  // get the name from databasesss
  request({
    url: "https://slack.com/api/users.info?token=" + SLACK_ACCESS_TOKEN + "&user=" + msg.body.event.user,
    json: true
  }, function (error, response, body) {
    msg.say(responseText + " " + body.user.name + "! How can I help you " + "?")

  });
}

//send request to APi AI and get back with Json object and detrmine the action 
function sendRequestToApiAi(emailValue, msg) {
  toffyHelper.storeUserSlackInformation(emailValue, msg);
  var msgText = msg.body.event.text;
  let apiaiRequest = apiAiService.textRequest(msgText,
    {
      sessionId: sessionId
    });

  apiaiRequest.on('response', (response) => {
    let responseText = response.result.fulfillment.speech;
    //user ask for new personal vacation with from to dates

    //Vacation with leave scenarios
    if (responseText == "vacationWithLeave") {
      vacationWithLeave.vacationWithLeave(msg, response, emailValue)

    }


    //When user ask for help,response will be the menu of all things that he can do
    else if ((responseText) == "Help") {

      employee.sendHelpOptions(msg);
    }
    //show enployee vacation history 
    else if ((responseText) == "showHistory") {
      employee.showEmployeeHistory(emailValue, msg);
    }
    else if ((responseText) == "showStats") {
      employee.showEmployeeStats(emailValue, msg);
    }
    else if ((responseText) == "showRules") {
      employee.ShowRules(emailValue, msg);
    }
    else if ((responseText) == "showProfile") {
      employee.showEmployeeProfile(emailValue, msg);
    }
    else if ((responseText) == "showHolidays") {
      var date;
      var date1;
      var holidayRequestType = "";
      dateHelper.getTodayDate(function (today) {

        if (!(response.result.parameters.date != "")) {
          console.log("not equal")
        }
        if (response.result.parameters.holiday_synonymes && !(response.result.parameters.next_synonymes) && !(response.result.parameters.date && response.result.parameters.date != "") && !(response.result.parameters.date1) && !(response.result.parameters.number)) {
          date = "2017-01-01";
          date1 = "	2017-12-30";
        } else if (response.result.parameters.holiday_synonymes && (response.result.parameters.next_synonymes) && !(response.result.parameters.date && response.result.parameters.date != "") && !(response.result.parameters.date1) && !(response.result.parameters.number)) {
          console.log("1")
          date = today
          date1 = "	2017-12-30"
          holidayRequestType = 2;
        } else if (response.result.parameters.holiday_synonymes && (response.result.parameters.next_synonymes) && !(response.result.parameters.date && response.result.parameters.date != "") && !(response.result.parameters.date1) && (response.result.parameters.number)) {
          date = today
          date1 = "	2017-12-30"
          holidayRequestType = 3;
        }
        else {
          date = response.result.parameters.date;
          date1 = response.result.parameters.date1;
        }
        toffyHelper.showHolidays(msg, emailValue, date, date1, holidayRequestType, response);

      })
    }
    else if ((responseText) == "ShowAllHolidaysInCurrentyear") {
      var date = "2017-01-01";
      var date1 = "	2017-12-30";
      toffyHelper.showHolidays(msg, emailValue, date, date1);
    }


    else if ((response.result.action) == "input.welcome") {
      SendWelcomeResponse(msg, responseText)
    } else msg.say(responseText)
  });

  fromDate = ""
  toDate = ""
  apiaiRequest.on('error', (error) => console.error(error));
  apiaiRequest.end();
}



//get all information about team users like email ,name ,user id ...sssss
//**********************************************************************************************
function getMembersList(Id, msg) {
  console.log("SLACK_ACCESS_TOKEN=====>   " + SLACK_ACCESS_TOKEN)
  var emailValue = "";
  request({
    url: Constants.SLACK_MEMBERS_LIST_URL + "" + SLACK_ACCESS_TOKEN,
    json: true
  }, function (error, response, body) {

    if (!error && response.statusCode === 200) {
      var i = 0;
      while ((body.members[i] != null) && (body.members[i] != undefined)) {

        if (body.members[i]["id"] == Id) {
          emailValue = body.members[i]["profile"].email;
          sendRequestToApiAi(emailValue, msg);
          break;
        }
        console.log("the email:");
        console.log(body.members[i]["profile"].email);

        i++;
      }
    }
  });
}
//*************************************************************************************************

//**************************************************************************************************



//*********************************************
var app = slapp.attachToExpress(express())
slapp.message('(.*)', ['direct_message'], (msg, text, match1) => {
  console.log("the Ip  ====>" + IP)
  if (msg.body.event
    .user == "U4EN9UDHV") {
    console.log("=============>message from  bot ")

  } else {
    console.log("I am not the bot")
    var stringfy = JSON.stringify(msg);
    console.log(stringfy);
    getMembersList(msg.body.event.user, msg)


  }

})


slapp.event('file_shared', (msg) => {
  console.log("msg  " + JSON.stringify(msg));
  console.log('===========>Uploaded file');
  fromDate = "";
  toDate = "";
})



slapp.action('leave_with_vacation_confirm_reject', 'confirm', (msg, value) => {
  userAction(msg, value, 0)
})
slapp.action('leave_with_vacation_confirm_reject', 'Undo', (msg, value) => {
  var arr = value.toString().split(";");
  var fromTime = arr[0]
  var toTime = arr[1]
  var email = arr[2];
  var fromDateInMilliseconds = arr[3];
  var toDateInMilliseconds = arr[4]
  var type = arr[5]
  var workingDays = arr[6]
  var wordFromDate = arr[7]
  var wordToDate = arr[8]
  var messageText = arr[9]
  console.log("Value" + value)
  console.log("messageText" + messageText)
  messageReplacer.undoUserComment(msg, fromTime, toTime, email, fromDateInMilliseconds, toDateInMilliseconds, type, workingDays, wordFromDate, wordToDate, messageText);
})
slapp.action('leave_with_vacation_confirm_reject', 'Send_Commnet', (msg, value) => {
  userAction(msg, value, 1)
})
function userAction(msg, value, isComment) {
  dateHelper.getTodayDate(function (todayDate) {
    var arr = value.toString().split(";");
    var type = arr[5]
    var email = arr[2];
    var fromDateInMilliseconds = arr[3];
    var toDateInMilliseconds = arr[4]
    var workingDays = arr[6]
    var fromDate = arr[7]
    var toDate = arr[8]
    var comment = ""
    if (isComment == 1) {
      comment = arr[10]

    }
    var uploadSickReportButton = ""


    toffyHelper.sendVacationPostRequest(/*from  */fromDateInMilliseconds, toDateInMilliseconds, toffyHelper.userIdInHr, email, type, function (vacationId, managerApproval) {

      dateHelper.convertTimeFormat(arr[0], function (formattedTime, midday) {

        dateHelper.convertTimeFormat(arr[1], function (formattedTime1, midday1) {

          toDate = toDate
          if (arr[0] && (arr[0] != undefined)) {
            fromDate = fromDate + " at " + formattedTime + " " + midday
          } else fromDate = fromDate + " at 08:00 am ";

          if (arr[1] && (arr[1] != undefined)) {
            toDate = toDate + " at " + formattedTime1 + " " + midday1
          } else toDate = toDate + " at 05:00 pm ";


          if (!managerApproval[0]) {
            msg.say("You dont have any approver right now ");
          } else {
            toffyHelper.sendVacationToManager(fromDate, toDate, arr[2], type, vacationId, managerApproval, "Manager", workingDays, comment)
            var messageFB = ""
            if (type == "sick") {
              messageFB = "Sick time off request has been submitted to your managers and HR admin. You have to submit a sick report within one week maximum. Otherwise, it will be considered as a personal time off. "

            }
            else
              messageFB = "Your request ( " + fromDate + " to " + toDate + " ) has been submitted and is awaiting your managers approval "
            if (type == "sick") {
              uploadSickReportButton = {
                "name": "upload_sick_report",
                "text": "Upload sick report ",
                "type": "button",
                "value": email + ";" + vacationId + ";" + fromDate + ";" + toDate
              }
            }

            var text12 = {
              "text": "",
              "attachments": [
                {
                  "text": messageFB,
                  "callback_id": 'cancel_request',
                  "color": "#3AA3E3",
                  "attachment_type": "default",
                  "actions": [
                    {
                      "name": 'cancel',
                      "text": "Cancel Request",
                      "style": "danger",
                      "type": "button",
                      "value": email + ";" + vacationId + ";" + JSON.stringify(managerApproval) + ";" + fromDate + ";" + toDate + ";" + type

                    }, uploadSickReportButton
                  ]
                }
              ]
            }
            console.log("cancel_request1" + JSON.stringify(managerApproval))

            msg.respond(msg.body.response_url, text12)

          }
        });

      });

    });
  })
  fromDate = "";
  toDate = "";

}

slapp.action('leave_with_vacation_confirm_reject', 'reject', (msg, value) => {
  msg.respond(msg.body.response_url, "Ok, operation aborted.")
  fromDate = "";
  toDate = "";
})
slapp.action('leave_with_vacation_confirm_reject', 'yesWithComment', (msg, value) => {
  var arr = value.toString().split(";");
  var fromTime = arr[0]
  var toTime = arr[1]
  var email = arr[2];
  var fromDateInMilliseconds = arr[3];
  var toDateInMilliseconds = arr[4]
  var type = arr[5]
  var workingDays = arr[6]
  var wordFromDate = arr[7]
  var wordToDate = arr[8]
  var messageText = arr[9]
  console.log("Value" + value)
  console.log("messageText" + messageText)
  messageReplacer.replaceWithComment(msg, fromTime, toTime, email, fromDateInMilliseconds, toDateInMilliseconds, type, workingDays, wordFromDate, wordToDate, messageText)
})
slapp.action('cancel_request', 'cancel', (msg, value) => {
  var arr = value.toString().split(";")
  var email = arr[0]
  var vacationId = arr[1]
  var managerApproval = arr[2]
  var fromDate = arr[3]
  var toDate = arr[4]
  var type = arr[5]
  toffyHelper.getNewSessionwithCookie(email, function (remember_me_cookie, session_Id) {
    //get vacation state
    var uri = 'http://' + IP + '/api/v1/vacation/' + vacationId
    request({
      url: uri, //URL to hitDs
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': remember_me_cookie + ";" + session_Id

      }
      //Set the body as a stringcc
    }, function (error, response, body) {
      console.log("(JSON.parse(body)).vacationState " + (JSON.parse(body)).vacationState)
      toffyHelper.isManagersTakeAnAction(JSON.parse(body).managerApproval, function (isThereIsAction) {
        console.log("isThereIsAction" + isThereIsAction)
        if (isThereIsAction == false) {
          //delete vacation request
          request({
            url: 'http://' + IP + '/api/v1/vacation/' + vacationId,
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Cookie': remember_me_cookie + ";" + session_Id
            },
          }, function (error, response, body) {
            msg.respond(msg.body.response_url, "Request canceled")
            msg.say("Your " + type + " time off request from ( " + fromDate + "-" + toDate + " ) has been canceled")
            toffyHelper.sendCancelationFeedBackToManagers(fromDate, toDate, email, vacationId, managerApproval, type)

          })
        } else {
          //the managers take an action
          msg.respond(msg.body.response_url, "Sorry ,you can't cancel your time off request ,since your managers take an action.Please contact them")


        }
      })

    })

  })
})


/*--------------___________________________________________________----------------------
End of Leave Section
  -------------____________________________________________________---------------------
  */
//upload sick report button 
slapp.action('cancel_request', 'upload_sick_report', (msg, value) => {
  console.log("upload sick report")
  var arr = value.toString().split(";")
  var email = arr[0]
  var vacationId = arr[1]

  var fromDate = arr[2]
  var toDate = arr[3]
  msg.say("Tap the follownig link to upload your sick report http://172.30.204.243:9090/sick-report?vId=" + vacationId);
  console.log()
})
slapp.event('team_join', (msg) => {
  console.log('received team join event')
});

app.get('/', function (req, res) {
  res.send('Hello')
})
app.use(bodyParser.text({ type: 'application/json' }));

app.post('/birthday', (req, res) => {
  console.log("New get request is received");
  // work /var state= req.param('code')
  console.log(req.body);

  var email = JSON.parse(req.body)[0].email
  messageSender.sendMessageSpecEmployee(email, "With all the best")
  res.send("200");

});
app.post('/uploaded_sick_report', (req, res) => {
  console.log(" New get request is received");
  console.log(req.body)
  var parsedBody = JSON.parse(req.body)
  var vacationId = parsedBody.id
  var type = parsedBody.type
  var fromDate = parsedBody.fromDate

  var toDate = parsedBody.toDate

  var email = parsedBody.employee.email
  var attachmentsUrl = parsedBody.attachments[0].reference
  var managerApproval = parsedBody.managerApproval
  var profilePicture = parsedBody.employee.profilePicture
  dateHelper.converDateToWords(fromDate, toDate, function (fromDateWord, toDateWord) {
    console.log("fromDateWord" + fromDateWord)
    console.log("toDateWord" + toDateWord)
    console.log("profilePicture" + profilePicture)
    console.log("managerApproval: " + managerApproval)
    console.log("managerApproval: " + JSON.stringify(managerApproval))
    console.log("type" + type)
  })
  res.send(200)

});

app.post('/newat', (req, res) => {
  var code = req.param('access_token');
});

console.log('Listening on :' + process.env.PORT)
app.listen(process.env.PORT)
