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
    if (responseText == "newVacationRequest") {
      vacation.sendVacationConfirmationToEmp(msg, response.result.parameters.date, response.result.parameters.date1, emailValue, "time off")
    }
    //Vacation with leave scenarios
    else if (responseText == "vacationWithLeave") {
      //get the milliseconds for the  end of the vacation 
      var date = response.result.parameters.date;
      date = date + " " + "17:00:00"
      console.log(date);
      date = new Date(date);
      var dateMilliSeconds = date.getTime();
      console.log("dateMilliSeconds:::" + dateMilliSeconds)

      var time = response.result.parameters.time;
      getTodayDate(function (today) {
        today = today + " " + time;
        console.log(today);
        var timeMilliseconds = new Date(today);
        timeMilliseconds = timeMilliseconds.getTime();
        console.log("timeMilliseconds:::" + timeMilliseconds)

      })

    }

    if (response.result.parameters.vacation_type == "personal") {
      vacation_type = "time off"
    }
    //end 


    //user ask for one day personal vacation
    else if (responseText == "oneDayPersonalVacation") {
      vacation.sendOneDayVacationConfirmationtoEmp(msg, response.result.parameters.date, response.result.parameters.date, emailValue, "time off")

    }
    else if (responseText == "newSickVacationResponseRange") {
      var vacation_type = response.result.parameters.vacation_type
      if (response.result.parameters.vacation_type == "personal") {
        vacation_type = "time off"
      }
      vacation.sendVacationConfirmationToEmp(msg, response.result.parameters.date, response.result.parameters.date1, emailValue, vacation_type)


    }
    //One  day sick  vacation  ,so the user just determine the day he was sick in
    else if (responseText == "oneDaySickVacation") {
      vacation.sendOneDaySickVacationConfirmationtoEmp(msg, response.result.parameters.date, response.result.parameters.date, emailValue, "sick")
    }
    // The user ask for vacation as conversation
    else if ((responseText) == "newVacationRequestWithoutDates") {
      msg.say("Sick or personal vacation ?")
    }
    //determine the type of vacation if its sick or personal vacations
    else if ((responseText) == "typeOfVacation") {
      if ((fromDate != "") && (toDate != "")) {
        typeOfVacation = response.result.parameters.vacationType;
        vacation.sendVacationConfirmationToEmp(msg, fromDate, toDate, emailValue, typeOfVacation);
      }
      else {
        typeOfVacation = response.result.parameters.vacationType;
        if (typeOfVacation == "sick") {
          msg.say("Sorry to hear that. What days were you sick?")
        }
        else msg.say("what are the dates?");
      }
    }
    //The user ask for one day vacation in conversation
    else if ((responseText) == "oneDayVacationConversation") {
      if (typeOfVacation != "") {

        vacation.sendOneDayVacationConfirmationtoEmp(msg, response.result.parameters.date, response.result.parameters.date, emailValue, typeOfVacation)
        fromDate = ""
        toDate = ""
      }
    }
    // the user ask for vacation in conversation scenario
    else if ((responseText) == "sickVacation") {
      typeOfVacation = "sick";
      msg.say("Sorry to hear that. What days were you sick?")

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

    /*--------------___________________________________________________----------------------
    Leave Section
    -------------____________________________________________________---------------------
    */

    else if ((responseText) == "newLeaveRequestSpecTimeToday") {
      console.log(JSON.stringify(response))
      console.log(response)
      leave.sendLeaveSpecTimeTodayConfirmation(msg, response.result.parameters.time, emailValue, "leave");
      console.log("response.result.parameters.time " + response.result.parameters.time)
    }
    else if ((responseText) == "SickLeave") {
      console.log("Sick leave")
      console.log(response)
      leave.sendLeaveSpecTimeTodayConfirmation(msg, response.result.parameters.time, emailValue, "sickLeave");
      console.log("response.result.parameters.time " + response.result.parameters.time)
    }

    else if ((responseText) == "newLeaveRequestSpecTimeSpecDay") {
      var arr = (response.result.parameters.date_time).toString().split("T")//split the date from time since the response return both as one variable
      var time = arr[1].toString().split("Z")
      leave.sendLeaveSpecTimeSpecDayConfirmation(msg, time[0], arr[0], emailValue, "leave");
    }
    else if ((responseText) == "newLeaveRequestRangetimeToday") {
      var arr = (response.result.parameters.time_period).toString().split("/")//split the date from time since the response return both as one variable

      leave.sendLeaveRangeTimeTodayConfirmation(msg, arr[0], arr[1], emailValue, "leave");
    }
    else if ((responseText) == "newLeaveRequestRangeTimeSpecDay") {
      var arr = (response.result.parameters.time_period).toString().split("/")//split the date from time since the response return both as one variable
      // from time =arr[0] to time =arr[1]
      var date = response.result.parameters.date;
      leave.sendLeaveRangeTimeSpecDayConfirmation(msg, arr[0], arr[1], date, emailValue, "leave");
    }
    else if ((responseText) == "leaveRequestWithoutTime") {
      msg.say("Please specify the day and time ")
      leaveFlag = "true";
    }
    else if ((responseText) == "newLeaveRequestSpecDaySpecTimeConv") {
      if (leaveFlag == "true") {
        var arr = (response.result.parameters.date_time).toString().split("T")//split the date from time since the response return both as one variable
        var time = arr[1].toString().split("Z")
        leave.sendLeaveSpecTimeSpecDayConfirmation(msg, time[0], arr[0], emailValue, "leave");
        leaveFlag = "";
      }
    }

    /*--------------___________________________________________________----------------------
     End of Leave Section
     -------------____________________________________________________---------------------
     */

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
    else if ((responseText) == "sickInfo") {
      msg.say("Sorry to hear that. What dayss were you sick?")
      sickFlag = "true";
    }
    else if ((responseText) == "sickRequestJustDates") {
      if (sickFlag == "true") {
        msg.say("I will request a vacation for you");
        sickFlag = "";

      }
      else msg.say("I cant understand you")
    }
    else if ((response.result.action) == "input.welcome") {
      SendWelcomeResponse(msg, responseText)
    }
    else if ((responseText) == "profile") {
      sendUserProfile(msg);
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

  today = mm + '/' + dd + '/' + yyyy;
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

slapp.action('confirm_reject', 'confirm', (msg, value) => {

  var arr = value.toString().split(",");
  var email = arr[2];
  var workingDays = arr[4]

  toffyHelper.sendVacationPostRequest(arr[0], arr[1], toffyHelper.userIdInHr, email, arr[3], function (vacationId, managerApproval) {
    console.log("vacationId--------->" + vacationId);
    console.log("managersApproval--------->" + managerApproval[0].id);
    console.log("managersApproval--------->" + JSON.stringify(managerApproval));
    if (!managerApproval[0]) {
      msg.say("You dont have any manager right now ");
    } else {
      toffyHelper.sendVacationToManager(arr[0], arr[1], arr[2], arr[3], vacationId, managerApproval, "Manager", workingDays)

      if (arr[3] == "sick") {
        console.log("Manager approvals sick vacation is ::" + JSON.stringify(managerApproval))
        msg.respond(msg.body.response_url, "Your request has been submitted to your managers and HR admin. You might asked to provide a sick report. I’ll inform you about this.  ")

      }
      else
        msg.respond(msg.body.response_url, "Your request has been submitted and is awaiting your managers approval ")
    }

  })

  fromDate = "";
  toDate = "";

})

slapp.action('confirm_reject', 'reject', (msg, value) => {

  var arr = value.toString().split(",");
  msg.respond(msg.body.response_url, "Ok. Operation aborted ")
  fromDate = "";
  toDate = "";
})
/*--------------___________________________________________________----------------------
  Leave Section which we  handle actions from user
  -------------____________________________________________________---------------------
  */
slapp.action('leave_confirm_reject', 'confirm', (msg, value) => {
  getTodayDate(function (todayDate) {
    var arr = value.toString().split(",");
    console.log("arrrrrrrr--------->  " + arr[1])
    console.log("arrrrrrrr--------->  " + arr[2])
    console.log("arrrrrrrr--------->  " + arr[3])
    console.log("arrrrrrrr--------->  " + arr[4])
    var email = arr[1];


    var vacationType = arr[4]
    var workingDays = arr[5]
    toffyHelper.sendVacationPostRequest(/*from  */arr[2], arr[3], toffyHelper.userIdInHr, email, vacationType, function (vacationId, managerApproval) {
      console.log("vacationId--------->" + vacationId);

      console.log("managersApproval--------->" + JSON.stringify(managerApproval));
      console.log("managersApproval--------->" + managerApproval[0].id);

      toffyHelper.convertTimeFormat(arr[0], function (formattedTime, midday) {
        fromDate = todayDate + " T " + formattedTime + " " + midday
        toDate = todayDate + " T 5:00 pm "
        if (!managerApproval[0]) {
          msg.say("You dont have any manager right now ");
        } else {
          toffyHelper.sendVacationToManager(fromDate, toDate, email, vacationType, vacationId, managerApproval, "Manager", workingDays)
          msg.say("Your leave request have been submitted to your managers.");
        }

      });

    })

  });
  fromDate = "";
  toDate = "";
})
//------------------------------
slapp.action('leave_confirm_reject', 'reject', (msg, value) => {
  msg.say("Ok,request aborted");
  fromDate = "";
  toDate = "";
})

slapp.action('leave_spectime_specDay_confirm_reject', 'confirm', (msg, value) => {

  var arr = value.toString().split(",");
  console.log("arrrrrrrr--------->  " + arr[2])
  console.log("arrrrrrrr--------->  " + arr[3])
  var email = arr[2];
  var workingDays = arr[6]
  toffyHelper.sendVacationPostRequest(/*from  */arr[3], arr[4], toffyHelper.userIdInHr, email, arr[5], function (vacationId, managerApproval) {
    console.log("vacationId--------->" + vacationId);

    console.log("managersApproval--------->" + JSON.stringify(managerApproval));
    console.log("managersApproval--------->" + managerApproval[0].id);

    toffyHelper.convertTimeFormat(arr[0], function (formattedTime, midday) {
      fromDate = arr[1] + " T " + formattedTime + " " + midday
      toDate = arr[1] + " T 5:00 pm "
      if (!managerApproval[0]) {
        msg.say("You dont have any manager right now ");
      } else {
        toffyHelper.sendVacationToManager(fromDate, toDate, arr[2], arr[5], vacationId, managerApproval, "Manager", workingDays)
        msg.say("Your leave request have been submitted to your managers.");
      }

    });
  })


  fromDate = "";
  toDate = "";

})
slapp.action('leave_spectime_specDay_confirm_reject', 'reject', (msg, value) => {
  msg.say("Ok,request aborted");
  fromDate = "";
  toDate = "";
})
slapp.event('file_shared', (msg) => {
  console.log("msg  " + JSON.stringify(msg));
  console.log('===========>Uploaded file');
  fromDate = "";
  toDate = "";
})
slapp.action('leave_rangeTime_today_confirm_reject', 'confirm', (msg, value) => {
  getTodayDate(function (todayDate) {
    var arr = value.toString().split(",");
    var email = arr[2]
    var workingDays = arr[6]
    toffyHelper.sendVacationPostRequest(/*from  */arr[3], arr[4], toffyHelper.userIdInHr, email, arr[5], function (vacationId, managerApproval) {

      toffyHelper.convertTimeFormat(arr[0], function (formattedTime, midday) {

        toffyHelper.convertTimeFormat(arr[1], function (formattedTime1, midday1) {

          fromDate = todayDate + " T " + formattedTime + " " + midday
          toDate = todayDate + " T " + formattedTime1 + " " + midday1
          if (!managerApproval[0]) {
            msg.say("You dont have any manager right now ");
          } else {
            toffyHelper.sendVacationToManager(fromDate, toDate, arr[2], "leave", vacationId, managerApproval, "Manager", workingDays)
            msg.say("Your leave request have been submitted to your managers.");

          }
        });

      });

    });
  })
  fromDate = "";
  toDate = "";

})
slapp.action('leave_rangeTime_today_confirm_reject', 'reject', (msg, value) => {
  msg.say("Ok,request aborted");
  fromDate = "";
  toDate = "";

})
slapp.action('leave_rangeTime_specDay_confirm_reject', 'confirm', (msg, value) => {
  getTodayDate(function (todayDate) {

    var arr = value.toString().split(",");
    var email = arr[3];
    var workingDays = arr[7]
    toffyHelper.sendVacationPostRequest(/*from  */arr[4], arr[5], toffyHelper.userIdInHr, email, "personal", function (vacationId, managerApproval) {
      console.log("leave manager approval" + JSON.stringify(managerApproval))
      toffyHelper.convertTimeFormat(arr[0], function (formattedTime, midday) {

        toffyHelper.convertTimeFormat(arr[1], function (formattedTime1, midday1) {

          fromDate = todayDate + " T " + formattedTime + " " + midday
          toDate = todayDate + " T " + formattedTime1 + " " + midday1
          if (!managerApproval[0]) {
            msg.say("You dont have any manager right now ");
          } else {
            toffyHelper.sendVacationToManager(fromDate, toDate, arr[3], "leave", vacationId, managerApproval, "Manager", workingDays)
            msg.say("Your leave request have been submitted to your managers.");

          }
        });
      })
    })
  });
  fromDate = "";
  toDate = "";
})
slapp.action('leave_rangeTime_specDay_confirm_reject', 'reject', (msg, value) => {
  msg.say("Ok,request aborted");
  fromDate = "";
  toDate = "";
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
