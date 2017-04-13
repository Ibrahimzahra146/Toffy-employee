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
var vacation_type1 = ""
var apiAiService = apiai(APIAI_ACCESS_TOKEN);
var IP = process.env.SLACK_IP;
var APIAI_ACCESS_TOKEN = process.env.APIAI_ACCESS_KEY;
var SLACK_ACCESS_TOKEN = process.env.SLACK_APP_ACCESS_KEY;
var SLACK_BOT_TOKEN = process.env.SLACK_BOT_ACCESS_KEY;
var SLACK_HR_TOKEN = process.env.SLACK_HR_ACCESS_KEY;
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

function SendWelcomeResponse(msg, responseText) {
  console.log("the aoo token " + msg.meta.app_token);
  console.log("the user" + msg.body.event.user)
  // get the name from databasesss
  request({
    url: "https://slack.com/api/users.info?token=" + SLACK_ACCESS_TOKEN + "&user=" + msg.body.event.user,
    json: true
  }, function (error, response, body) {
    msg.say(responseText + " " + body.user.name + "! How can I help you " + "?")

  });
}

//Leave confirmation Section

//------------------------------***************************************-----------------------------
function getSalesForceAccessToken(code1) {
  console.log("the code is " + code1)
  request({
    url: 'https://login.salesforce.com/services/oauth2/token', //URL to hitDs
    qs: {
      grant_type: 'authorization_code',
      client_secret: Constants.CLIENT_SECRET,
      client_id: Constants.CLIENT_ID,
      redirect_uri: 'https://www.facebook.com/',
      code: code1
    }, //Query string data
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'Hello Hello! String body!' //Set the body as a stringcc
  }, function (error, response, body) {
    if (error) {
      console.log(error);
    } else {
      console.log(body)
      var data = JSONbig.parse(body);

      console.log("Your Slack Id is  '" + generalMsg.body.event.user + "'" + " and your  Salesforce access token is  '" + data.access_token + "'");
      salesforceCode = data.access_token;
    }
  });
}
//***************************************************************--------------------------------------

function sendUserProfile(msg) {
  request({
    url: Constants.SLACK_USER_INFO_URL + "" + msg.meta.app_token + "&user=" + msg.body.event.user,
    json: true
  }, function (error, response, body) {

    if (!error && response.statusCode === 200) {
      msg.say("based on your App token ' " + SLACK_ACCESS_TOKEN + "' and your user id, '" + msg.body.event.user + "'  your name is " + body.user.name)
    }
  });
}
//**************************************************************************************

//send vacation request to back-end
//************************************************************************ new function

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
    console.log("responseText:::" + responseText)
    //user ask for new personal vacation with from to dates

    //Vacation with leave scenarios
    if (responseText == "vacationWithLeave") {
      var other_vacation_types = ""
      var messageText = ""
      getTodayDate(function (today) {
        var time1 = "17:00:00";
        var time = "8:00:00";
        var date = today
        var date1 = today
        var timeOffCase = -1

        if (response.result.parameters.sick_synonyms) {
          vacation_type1 = "sick"
        }
        else if (response.result.parameters.other_vacation_types) {
          other_vacation_types = response.result.parameters.other_vacation_types;
          if (other_vacation_types == "Maternity")
            vacation_type1 = "Maternity"
          else if (other_vacation_types == "Paternity")
            vacation_type1 == "Paternity"

        }
        if (response.result.parameters.time_off_types && !(response.result.parameters.time) && !(response.result.parameters.time1) && !(response.result.parameters.date) && !(response.result.parameters.date1)) {

          msg.say("Please specify the date and/or time ")



        }
        else if (response.result.parameters.sick_synonyms && !(response.result.parameters.time) && !(response.result.parameters.time1) && !(response.result.parameters.date) && !(response.result.parameters.date1)) {
          msg.say("Please specify the date and/or time ")


          vacation_type1 = "sick"

        }
        else if (response.result.parameters.time_off_types && !(response.result.parameters.time) && !(response.result.parameters.time1) && (response.result.parameters.date == "") && !(response.result.parameters.date1)) {
          msg.say("Please specify the date and/or time ")
        } else if (response.result.parameters.sick_synonyms && response.result.parameters.date == "") {
          msg.say("Please specify the date and/or time ")
          vacation_type1 = "sick"
        }

        else {
          if (response.result.parameters.time && response.result.parameters.number_of_hours_indicators && response.result.parameters.time_types) {
            time = response.result.parameters.time

            if (response.result.parameters.time1) {

              console.log("time1 isnot empty")

              time1 = response.result.parameters.time1;
              time = time1;
              time1 = response.result.parameters.time;
              var arr = time1.toString().split(":")
              var arr1 = time.toString().split(":")
              console.log("arr[0]" + arr[0])
              console.log("arr[1]" + arr1[0])
              console.log((Number(arr[0]) + Number(arr1[0])) + Number("00"))


              arr[0] = (Number(arr[0]) + Number(arr1[0]) + Number("00"));
              arr[1] = (Number(arr[1]) + Number(arr1[1]) + Number("00"))
              arr[2] = (Number(arr[2]) + Number(arr1[2]) + Number("00"))
              time1 = arr[0] + ":" + arr[1] + ":" + arr[2]
              console.log("arr[0] + + arr[1] + + arr[2]" + time1)
              console.log("time:" + time)
            }
            else {
              console.log("time1 is empty")
              var d = new Date(); // for now
              time1 = (Number(d.getHours()) + 3) + ":" + d.getMinutes() + ":" + d.getSeconds()
              console.log("arr[0] + + arr[1] + + arr[2]" + time1)
              console.log("time:" + time)
              time = time1;
              time1 = response.result.parameters.time;
              var arr = time1.toString().split(":")
              var arr1 = time.toString().split(":")
              console.log("arr[0]" + arr[0])
              console.log("arr[1]" + arr1[0])
              console.log((Number(arr[0]) + Number(arr1[0]) + Number("00")))


              arr[0] = (Number(arr[0]) + Number(arr1[0]) + Number("00"));
              arr[1] = (Number(arr[1]) + Number(arr1[1]) + Number("00"))
              arr[2] = (Number(arr[2]) + Number(arr1[2]) + Number("00"))
              time1 = arr[0] + ":" + arr[1] + ":" + arr[2]

            }


            timeOffCase = 5
          }
          else if (response.result.parameters.time && response.result.parameters.time1 && response.result.parameters.date && response.result.parameters.date1) {

            time = response.result.parameters.time
            time1 = response.result.parameters.time1
            date = response.result.parameters.date;
            date1 = response.result.parameters.date1;
            if (response.result.parameters.date == "") {
              date = today
            }
            timeOffCase = 1

          }
          else if (response.result.parameters.time && response.result.parameters.time1 && response.result.parameters.date1) {

            time = response.result.parameters.time
            time1 = response.result.parameters.time1
            date = response.result.parameters.date1
            date1 = response.result.parameters.date1
            if (response.result.parameters.date1 == "") {
              date = today
              date1 = today
            }

            timeOffCase = 2

          } else if (response.result.parameters.time && response.result.parameters.time1 && response.result.parameters.date) {
            time = response.result.parameters.time
            time1 = response.result.parameters.time1
            date = response.result.parameters.date
            date1 = response.result.parameters.date
            if (response.result.parameters.date == "") {
              date = today
              date1 = today
            }
            timeOffCase = 3

          }

          else if (response.result.parameters.time && response.result.parameters.date && response.result.parameters.date1) {
            time = response.result.parameters.time

            date = response.result.parameters.date
            date1 = response.result.parameters.date1
            if (response.result.parameters.date == "") {
              date = today
            }
            timeOffCase = 4

          } else if (response.result.parameters.time && response.result.parameters.time1) {
            time = response.result.parameters.time
            time1 = response.result.parameters.time1
            timeOffCase = 5

          } else if (response.result.parameters.time && response.result.parameters.date) {
            time = response.result.parameters.time
            date = response.result.parameters.date
            date1 = response.result.parameters.date
            if (response.result.parameters.date == "") {
              date = today
              date1 = date
            }
            timeOffCase = 6

          }
          else if (response.result.parameters.time && response.result.parameters.date1) {
            time = response.result.parameters.time
            date1 = response.result.parameters.date1
            if (response.result.parameters.date1 == "") {
              date1 = today
            }
            timeOffCase = 7

          }
          else if (response.result.parameters.date && response.result.parameters.date1) {
            date = response.result.parameters.date
            date1 = response.result.parameters.date1
            timeOffCase = 8

          }
          else if (response.result.parameters.date) {
            timeOffCase = 9

            var numberOfDaysToAdd = ""
            console.log("Case 9" + response.result.parameters.date)

            date = response.result.parameters.date
            date1 = response.result.parameters.date
            if (response.result.parameters.other_vacation_types) {
              if (vacation_type1 == "Maternity") {
                numberOfDaysToAdd = 70

              } else if (vacation_type1 == "Paternity") {
                numberOfDaysToAdd = 3
              }
              var someDate = new Date(date);
              someDate.setDate(someDate.getDate() + numberOfDaysToAdd);

              var dd = someDate.getDate();
              var mm = someDate.getMonth() + 1;
              var y = someDate.getFullYear();

              date1 = y + '/' + mm + '/' + dd;
              console.log("//" + date1)
              timeOffCase = 8
            }

          }
          else if (response.result.parameters.time) {
            time = response.result.parameters.time
            timeOffCase = 10

          }



          if (vacation_type1 == "") {
            vacation_type1 = "personal"
          }
          console.log("timeOffCase" + timeOffCase)
          //get the milliseconds for the  end of the vacation 
          leave.convertTimeFormat(time, function (x, y, convertedTime) {
            leave.convertTimeFormat(time1, function (x, y, convertedTime1) {
              console.log("convertedTime" + convertedTime)
              console.log("convertedTime1" + convertedTime1)


              var toDate = date1 + " " + convertedTime1
              console.log("toDate::" + toDate);

              var fromDate = date + " " + convertedTime;
              var timeMilliseconds = new Date(fromDate);
              timeMilliseconds = timeMilliseconds.getTime();
              timeMilliseconds = timeMilliseconds - (3 * 60 * 60 * 1000);
              console.log("timeMilliseconds :::" + timeMilliseconds)

              toDate = new Date(toDate);
              var dateMilliSeconds = toDate.getTime();
              dateMilliSeconds = dateMilliSeconds - (3 * 60 * 60 * 1000)


              console.log("timeMilliseconds :::" + timeMilliseconds)
              leave.sendVacationWithLeaveConfirmation(msg, convertedTime, date, convertedTime1, date1, timeMilliseconds, dateMilliSeconds, emailValue, vacation_type1, timeOffCase)
              vacation_type1 = ""
            })

          })



        }
      })

    }





    //when the user enter the date as ranger like 12-1 to 15-1
    else if ((responseText) == "dates") {
      console.log(" arrive at dates" + typeOfVacation)
      fromDate = response.result.parameters.date1;
      toDate = response.result.parameters.date
      if (typeOfVacation != "")
        //send Post request
        vacation.sendVacationConfirmationToEmp(msg, fromDate, toDate, emailValue, typeOfVacation);

      else msg.say("Sick or personal vacation?")
      fromDate = ""
      toDate = ""

    }


    //When user ask for help,response will be the menu of all things that he can do
    else if ((responseText) == "Help") {

      toffyHelper.sendHelpOptions(msg);
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
      var date = response.result.parameters.date;
      var date1 = response.result.parameters.date1;
      toffyHelper.showHolidays(msg, emailValue, date, date1);
    }
    else if ((responseText) == "ShowAllHolidaysInCurrentyear") {
      var date = "2017-01-01";
      var date1 = "	2017-12-30";
      toffyHelper.showHolidays(msg, emailValue, date, date1);
    }


    else if ((response.result.action) == "input.welcome") {
      SendWelcomeResponse(msg, responseText)
    }

    else if ((responseText) == "salesforce") {
      if (salesforceCode != "")
        msg.say("Your Slack Id is  '" + generalMsg.body.event.user + "'" + " and your  Salesforce access token is  '" + salesforceCode + "'");
      else {
        generalId = msg.body.event.user;
        generalMsg = msg;
        msg.say("You are not logged in, please visit this URL to login to Sales Force");
        msg.say("https://login.salesforce.com/services/oauth2/authorize?client_id=3MVG9HxRZv05HarRwahdcdooErBOoQcBqIyghM1uhSz5nqz4b66MpGNzzd7k2bV1I3WHHaEwOSeyNaeB2KuN6&response_type=code&redirect_uri=https://beepboophq.com/proxy/b1bddd9741944d5d9298c7c37691b6d4/newteam")
      }
    }

    else msg.say(responseText)
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
          console.log(body.members[i]["profile"].email);
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

function getTodayDate(callback) {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!
  var yyyy = today.getFullYear();

  if (dd < 10) {
    dd = '0' + dd
  }

  if (mm < 10) {
    mm = '0' + mm
  }

  today = yyyy + '/' + mm + '/' + dd;
  callback(today)

}

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
    console.log("the message");
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
  getTodayDate(function (todayDate) {
    var arr = value.toString().split(",");
    var type = arr[5]
    var email = arr[2];
    var fromDateInMilliseconds = arr[3];
    var toDateInMilliseconds = arr[4]
    var workingDays = arr[6]
    var fromDate = arr[7]
    var toDate = arr[8]
    console.log("type:::::" + type)
    console.log("email:::::" + email)
    console.log("toDate:::::" + toDate)
    console.log("fromDateInMilliseconds:::::" + fromDateInMilliseconds)
    console.log("toDateInMilliseconds:::::" + toDateInMilliseconds)
    console.log("workingDays:::::" + workingDays)
    console.log("fromDate:::::" + fromDate)
    console.log("toDate:::::" + toDate)

    toffyHelper.sendVacationPostRequest(/*from  */fromDateInMilliseconds, toDateInMilliseconds, toffyHelper.userIdInHr, email, type, function (vacationId, managerApproval) {

      toffyHelper.convertTimeFormat(arr[0], function (formattedTime, midday) {

        toffyHelper.convertTimeFormat(arr[1], function (formattedTime1, midday1) {

          toDate = toDate
          if (arr[0] && (arr[0] != undefined)) {
            fromDate = fromDate + " at " + formattedTime + " " + midday
          } else fromDate = fromDate + " at 08:00 am ";

          if (arr[1] && (arr[1] != undefined)) {
            toDate = toDate + " at " + formattedTime1 + " " + midday1
          } else toDate = toDate + " at 05:00 pm ";


          if (!managerApproval[0]) {
            msg.say("You dont have any manager right now ");
          } else {
            toffyHelper.sendVacationToManager(fromDate, toDate, arr[2], type, vacationId, managerApproval, "Manager", workingDays)
            var messageFB = ""
            if (type == "sick") {
              messageFB = "Your request has been submitted to your managers and HR admin. You might asked to provide a sick report. I’ll inform you about this.  "

            }
            else
              messageFB = "Your request has been submitted and is awaiting your managers approval "

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
                      "value": email + ";" + vacationId + ";" + JSON.stringify(managerApproval) + ";" + fromDate + ";" + toDate

                    }
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

})

slapp.action('leave_with_vacation_confirm_reject', 'reject', (msg, value) => {
  msg.say("Ok, operation aborted.")
  fromDate = "";
  toDate = "";
})
slapp.action('cancel_request', 'cancel', (msg, value) => {
  var arr = value.toString().split(";")
  var email = arr[0]
  var vacationId = arr[1]
  var managerApproval = arr[2]
  var fromDate = arr[3]
  var toDate = arr[4]
  console.log("cancel_request" + JSON.stringify(managerApproval))
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
            msg.respond(msg.body.response_url, "Your request has been canceled")
            toffyHelper.sendCancelationFeedBackToManagers(fromDate, toDate, email, vacationId, managerApproval)
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
slapp.event('team_join', (msg) => {
  console.log('received team join event')
});

app.get('/', function (req, res) {
  res.send('Hello')
})
app.use(bodyParser.text({ type: 'application/json' }));

app.get('/newteam', (req, res) => {
  console.log("New get request is received");
  // work /var state= req.param('code')
  var code = req.param('code');
  console.log("the data" + code);
  console.log("generalId " + generalId)
  getSalesForceAccessToken(code)
});

app.post('/newat', (req, res) => {
  var code = req.param('access_token');
});

console.log('Listening on :' + process.env.PORT)
app.listen(process.env.PORT)
