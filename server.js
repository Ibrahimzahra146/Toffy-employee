const env = require('./Public/configrations.js')

/**
 * 
 */
function SendWelcomeResponse(msg, responseText, flag, callback) {
  var id = ""
  if (flag == 1) {
    id = msg.body.user.id

  } else id = msg.body.event.user
  env.request({
    url: "https://slack.com/api/users.info?token=" + env.SLACK_ACCESS_TOKEN + "&user=" + id,
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
  console.log("Message from :" + emailValue)
  console.log("The message is :" + text)
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
          sessionId: env.sessionId
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
  var emailValue = "";
  env.mRequests.getSlackMembers(function (error, response, body) {

    if (!error && response.statusCode === 200) {
      var i = 0;
      while ((body.members[i] != null) && (body.members[i] != undefined)) {

        if (body.members[i]["id"] == Id) {
          emailValue = body.members[i]["profile"].email;
          sendRequestToApiAi(emailValue, msg, 0, "");
          break;
        }
        /* console.log("the email:");
         console.log(body.members[i]["profile"].email);*/

        i++;
      }
    }
  });
}
//*************************************************************************************************

//**************************************************************************************************



//*********************************************
var app = env.slapp.attachToExpress(env.express())
env.slapp.message('(.*)', ['direct_message'], (msg, text, match1) => {
  console.log("Recieved")
  env.generalMsg = msg
  if (msg.body.event.user == "U5TJH6BJ9") {

  } else {
    //console.log("The message is  " + JSON.stringify(msg))
    getMembersList(msg.body.event.user, msg)
  }
})

env.slapp.action('leave_with_vacation_confirm_reject', 'confirm', (msg, value) => {
  env.generalMsg = msg
  userAction(msg, value, 0)
})
env.slapp.action('leave_with_vacation_confirm_reject', 'Undo', (msg, value) => {
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
env.slapp.action('leave_with_vacation_confirm_reject', 'Send_Commnet', (msg, value) => {
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


    env.toffyHelper.sendVacationPostRequest(/*from  */fromDateInMilliseconds, toDateInMilliseconds, env.toffyHelper.userIdInHr, email, type, comment, function (vacationId, managerApproval, employee) {
      if (employee == 1000) {
        msg.say("Something went wrong,please try again. :cry:")
      } else {
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
              env.toffyHelper.sendVacationToManager(fromDate, toDate, arr[2], type, vacationId, managerApproval, employee, "Manager", workingDays, comment)
              var messageFB = ""
              if (type == "sick") {
                messageFB = env.stringFile.sickMessageAfterConfirmation

              }
              else
                messageFB = env.stringFile.personalMessageAfterConfirmation(fromDate, toDate)
              if (type == "sick") {
                // uploadSickReportButton = env.stringFile.uploadSickReportButton(email, vacationId, fromDate, toDate, messageFB);
              }

              var message_feedback_toEmp_after_confirmation = env.stringFile.cancelationButton(email, vacationId, managerApproval, fromDate, toDate, type, uploadSickReportButton, messageFB)

              msg.respond(msg.body.response_url, message_feedback_toEmp_after_confirmation)

            }
          });

        });
      }

    });
  })
  fromDate = "";
  toDate = "";

}

env.slapp.action('leave_with_vacation_confirm_reject', 'reject', (msg, value) => {
  env.generalMsg = msg
  msg.respond(msg.body.response_url, "Ok, operation aborted.")
  fromDate = "";
  toDate = "";
})
env.slapp.action('leave_with_vacation_confirm_reject', 'yesWithComment', (msg, value) => {
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
  env.messageReplacer.replaceWithComment(msg, fromTime, toTime, email, fromDateInMilliseconds, toDateInMilliseconds, type, workingDays, wordFromDate, wordToDate, messageText)
})
env.slapp.action('cancel_request', 'cancel', (msg, value) => {
  env.generalMsg = msg
  var arr = value.toString().split(";")
  var email = arr[0]
  var vacationId = arr[1]
  var managerApproval = arr[2]
  var fromDate = arr[3]
  var toDate = arr[4]
  var type = arr[5]
  env.mRequests.getVacationInfo(email, vacationId, function (error, response, body) {
    env.toffyHelper.isManagersTakeAnAction(JSON.parse(body).managerApproval, function (isThereIsAction, state) {
      console.log("isThereIsAction" + isThereIsAction)
      if (isThereIsAction == false) {
        //delete vacation request
        env.mRequests.deleteVacation(email, vacationId, function (error, response, body) {
          var messageAfterCanelation = env.stringFile.messageAfterCancelation(type, fromDate, toDate)
          msg.respond(msg.body.response_url, messageAfterCanelation)

          //toffyHelper.sendCancelationFeedBackToManagers(fromDate, toDate, email, vacationId, managerApproval, type)

        })
      } else {
        if (state == "Rejected")
          msg.respond(msg.body.response_url, env.stringFile.message_after_cancelation_rejected_timeoff)
        //the managers take an action
        else
          msg.respond(msg.body.response_url, env.stringFile.message_already_action_from_manager)


      }
    })

  })

})


/*--------------___________________________________________________----------------------
End of Leave Section
  -------------____________________________________________________---------------------
  */
//upload sick report button 
env.slapp.action('cancel_request', 'upload_sick_report', (msg, value) => {
  env.generalMsg = msg
  console.log("upload sick report")
  var arr = value.toString().split(";")
  var email = arr[0]
  var vacationId = arr[1]

  var fromDate = arr[2]
  var toDate = arr[3]
  var messageFB = arr[4]
  env.mRequests.getVacationInfo(email, vacationId, function (error, response, body) {
    if (JSON.parse(body).sickCovertedToPersonal == true) {
      msg.respond(msg.body.response_url, "This time off has been converted to personal time off ,since your approvers rejected it :sweat:")
    }
    else if (response.statusCode == 404) {
      msg.respond(msg.body.response_url, "Sorry!you can't upload report, since this vacation has been caneled.")

    } else if (JSON.parse(body).vacationState == "Rejected") {
      msg.respond(msg.body.response_url, "No need to upload sick report since this time off request was rejected.")
    } else if (JSON.parse(body).needsSickReport == false) {
      msg.respond(msg.body.response_url, "No need to upload sick report. No manager need a sick report from you.They changed their mind:stuck_out_tongue_winking_eye:")
    } else msg.respond(msg.body.response_url, env.stringFile.upload_sick_report_messsage(messageFB, vacationId));

  })


})
env.slapp.event('team_join', (msg) => {
  console.log('received team join event')
});

app.get('/', function (req, res) {
  res.send('Hello')
})
app.use(env.bodyParser.text({ type: 'application/json' }));

app.post('/birthday', (req, res) => {
  var email = JSON.parse(req.body)[0].email
  env.messageSender.sendMessageSpecEmployee(email, "With all the best")
  res.send("200");

});
app.post('/uploaded_sick_report', (req, res) => {
  console.log("New request recived")

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

env.slapp.action('preDefinedHelp', 'helpMenu', (msg, value) => {

  var email = SendWelcomeResponse(msg, "", 1, function (email) {
    sendRequestToApiAi(email, msg, 1, value);
  })

})

env.slapp.action('preDefinedHelp', 'fromDateToDate', (msg, value) => {

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
