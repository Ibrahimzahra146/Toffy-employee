const env = require('./Public/configrations.js')

/**
 * 
 */
function SendWelcomeResponse(msg, responseText, flag, callback) {
  var id = ""
  if (flag == 1) {
    id = msg.body.user.id

  } else id = msg.body.event.user
  request({
    url: "https://slack.com/api/users.info?token=" + SLACK_ACCESS_TOKEN + "&user=" + id,
    json: true
  }, function (error, response, body) {
    if (flag == 1) {
      callback(body.user.profile.email)
    } else
      msg.say(responseText + " " + body.user.name + "! How can I help you " + "?")

  });
}

//send request to APi AI and get back with Json object and detrmine the action 
function sendRequestToApiAi(emailValue, msg, flag, text) {
  env.toffyHelper.isActivated(emailValue, function (isActivated) {
    if (isActivated == false) {
      msg.say(env.stringFile.deactivatedMsg)

    }

    else {
      var msgText = ""
      if (flag == 1) {
        msgText = text
      } else {
        msgText = msg.body.event.text;

        env.toffyHelper.storeUserSlackInformation(emailValue, msg);
      }
      let apiaiRequest = env.apiAiService.textRequest(msgText,
        {
          sessionId: sessionId
        });

      apiaiRequest.on('response', (response) => {
        let responseText = response.result.fulfillment.speech;
        //user ask for new personal vacation with from to dates

        //Vacation with leave scenarios
        if (responseText == "vacationWithLeave") {
          env.vacationWithLeave.vacationWithLeave(msg, response, emailValue)

        }


        //When user ask for help,response will be the menu of all things that he can do
        else if ((responseText) == "Help") {

          env.employee.sendHelpOptions(msg, emailValue);
        }
        //show enployee vacation history 
        else if ((responseText) == "showHistory") {
          env.employee.showEmployeeHistory(emailValue, msg);
        }
        else if ((responseText) == "showStats") {
          env.employee.showEmployeeStats(emailValue, msg);
        }
        else if ((responseText) == "showRules") {
          env.employee.ShowRules(emailValue, msg);
        }
        else if ((responseText) == "showProfile") {
          env.employee.showEmployeeProfile(emailValue, msg);
        }
        else if ((responseText) == "showHolidays") {
          var date;
          var date1;
          var holidayRequestType = "";
          env.dateHelper.getTodayDate(function (today) {

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
            env.toffyHelper.showHolidays(msg, emailValue, date, date1, holidayRequestType, response);

          })
        }
        else if ((responseText) == "ShowAllHolidaysInCurrentyear") {
          var date = "2017-01-01";
          var date1 = "	2017-12-30";
          env.toffyHelper.showHolidays(msg, emailValue, date, date1);
        }


        else if ((response.result.action) == "input.welcome") {
          SendWelcomeResponse(msg, responseText, 0)
        } else msg.say(responseText)
      });

      fromDate = ""
      toDate = ""
      apiaiRequest.on('error', (error) => console.error(error));
      apiaiRequest.end();

    }
  })
}



//get all information about team users like email ,name ,user id ...sssss
//**********************************************************************************************
function getMembersList(Id, msg) {
  console.log("SLACK_ACCESS_TOKEN=====>    " + SLACK_ACCESS_TOKEN)
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
          sendRequestToApiAi(emailValue, msg, 0, "");
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
  env.generalMsg = msg
  if (msg.body.event.user == "U4EN9UDHV") {

  } else {
    getMembersList(msg.body.event.user, msg)
  }
})

slapp.action('leave_with_vacation_confirm_reject', 'confirm', (msg, value) => {
  env.generalMsg = msg
  userAction(msg, value, 0)
})
slapp.action('leave_with_vacation_confirm_reject', 'Undo', (msg, value) => {
  env.generalMsg = msg
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
  env.messageReplacer.undoUserComment(msg, fromTime, toTime, email, fromDateInMilliseconds, toDateInMilliseconds, type, workingDays, wordFromDate, wordToDate, messageText);
})
slapp.action('leave_with_vacation_confirm_reject', 'Send_Commnet', (msg, value) => {
  generalMsg = msg
  userAction(msg, value, 1)
})
function userAction(msg, value, isComment) {
  env.dateHelper.getTodayDate(function (todayDate) {
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


    env.toffyHelper.sendVacationPostRequest(/*from  */fromDateInMilliseconds, toDateInMilliseconds, toffyHelper.userIdInHr, email, type, comment, function (vacationId, managerApproval) {

      env.dateHelper.convertTimeFormat(arr[0], function (formattedTime, midday) {

        env.dateHelper.convertTimeFormat(arr[1], function (formattedTime1, midday1) {

          toDate = toDate
          if (arr[0] && (arr[0] != undefined)) {
            fromDate = fromDate
          } else fromDate = fromDate

          if (arr[1] && (arr[1] != undefined)) {
            toDate = toDate
          } else toDate = toDate


          if (!managerApproval[0]) {
            msg.say(env.stringFile.noApproversMessage);
          } else {
            env.toffyHelper.sendVacationToManager(fromDate, toDate, arr[2], type, vacationId, managerApproval, "Manager", workingDays, comment)
            var messageFB = ""
            if (type == "sick") {
              messageFB = env.stringFile.sickMessageAfterConfirmation

            }
            else
              messageFB = "Your request ( " + fromDate + " to " + toDate + " ) has been submitted and is awaiting your managers approval "
            if (type == "sick") {
              uploadSickReportButton = {
                "name": "upload_sick_report",
                "text": "Upload sick report ",
                "type": "button",
                "value": email + ";" + vacationId + ";" + fromDate + ";" + toDate + ";" + messageFB
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
  env.generalMsg = msg
  msg.respond(msg.body.response_url, "Ok, operation aborted.")
  fromDate = "";
  toDate = "";
})
slapp.action('leave_with_vacation_confirm_reject', 'yesWithComment', (msg, value) => {
  env.generalMsg = msg
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
  env.generalMsg = msg
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
      env.toffyHelper.isManagersTakeAnAction(JSON.parse(body).managerApproval, function (isThereIsAction, state) {
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
            msg.respond(msg.body.response_url, "Your " + type + " time off request from ( " + fromDate + "-" + toDate + " ) has been canceled")

            //toffyHelper.sendCancelationFeedBackToManagers(fromDate, toDate, email, vacationId, managerApproval, type)

          })
        } else {
          if (state == "Rejected")
            msg.respond(msg.body.response_url, "No need to cancel since its already rejected from your approvals.")
          //the managers take an action
          else
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
  env.generalMsg = msg
  console.log("upload sick report")
  var arr = value.toString().split(";")
  var email = arr[0]
  var vacationId = arr[1]

  var fromDate = arr[2]
  var toDate = arr[3]
  var messageFB = arr[4]
  msg.respond(msg.body.response_url, messageFB + "\nTap the follownig link to upload your <http://172.30.204.243:9090/sick-report?vId=" + vacationId + "|sick report>");

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
  env.messageSender.sendMessageSpecEmployee(email, "With all the best")
  res.send("200");

});
app.post('/uploaded_sick_report', (req, res) => {

  console.log(" New get request  is received");
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
  var workingDays = parseFloat(parsedBody.days).toFixed(2);
  env.dateHelper.converDateToWords(fromDate, toDate, 0, function (fromDateWord, toDateWord) {
    if (type == 0) type = "personal"
    if (type == 4) type = "sick"
    env.messageSender.sendVacationToHR(fromDateWord, toDateWord, email, type, vacationId, managerApproval, "", workingDays, "", profilePicture, attachmentsUrl)
  })
  res.send(200)

});
/**
 * 
 */

slapp.action('preDefinedHelp', 'helpMenu', (msg, value) => {

  var email = SendWelcomeResponse(msg, "", 1, function (email) {
    sendRequestToApiAi(email, msg, 1, value);
  })

})

slapp.action('preDefinedHelp', 'fromDateToDate', (msg, value) => {

  msg.say("Please specify the date.")
})


/**
 * Send notification to employe when there is one day l;eft to upload sick report
 */
app.post('/one_day_left_sRep', (req, res) => {
  var parsedBody = JSON.parse(req.body)
  var vacationId = parsedBody.id

  var fromDate = parsedBody.fromDate

  var toDate = parsedBody.toDate

  var email = parsedBody.employee.email
  env.dateHelper.converDateToWords(fromDate, toDate, 0, function (fromDateWord, toDateWord) {

    env.mRequests.getSlackRecord(email, function (body) {


      var responseBody = JSON.parse(body);
      var slackMsg = env.stringFile.Slack_Channel_Function(responseBody.userChannelId, responseBody.slackUserIdresponseBody.teamId);
      var messageFB = env.stringFile.oneDayLeftInfoMessage(fromDateWord, toDateWord)
      var text12 = env.stringFile.oneDayLeftSickJsonMessage(messageFB, email, vacationId, fromDateWord, toDateWord)
      env.bot.startConversation(slackMsg, function (err, convo) {


        if (!err) {

          var stringfy = JSON.stringify(text12);
          var obj1 = JSON.parse(stringfy);
          env.employeeBot.reply(slackMsg, obj1);

        }

      });
    })
  })
  res.send(200)
});

app.post('/newat', (req, res) => {
  var code = req.param('access_token');
});

console.log('Listening on :' + process.env.PORT)
app.listen(process.env.PORT)
