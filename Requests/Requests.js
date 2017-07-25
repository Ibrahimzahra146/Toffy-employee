const env = require('.././Public/configrations.js')


/**
 * Get slack user info like Slack Id ,team Id,hr channel ID
 * 
 */
module.exports.getSlackRecord = function getSlackRecord(email, callback) {
    console.log("getSlackRecord" + email)
    env.request({
        url: 'http://' + env.IP + '/api/v1/toffy/get-record', //URL to hitDs
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': 'JSESSIONID=24D8D542209A0B2FF91AB2A333C8FA70'
        },
        body: email
        //Set the body as a stringcc
    }, function (error, response, body) {
        console.log("getSlackRecord" + response.statusCode)
        if (response.statusCode == 500 || response.statusCode == 404) {
            callback(1000, response, 1000)

        }
        else callback(error, response, body)
    })
}
/**
 * 
 * Get vacation info
 */
module.exports.getVacationInfo = function getVacationInfo(email, vacationId, callback) {
    env.toffyHelper.getNewSessionwithCookie(email, function (remember_me_cookie, session_Id) {
        //get vacation state
        var uri = 'http://' + env.IP + '/api/v1/vacation/' + vacationId
        env.request({
            url: uri, //URL to hitDs
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': remember_me_cookie + ";" + session_Id

            }
            //Set the body as a stringcc
        }, function (error, response, body) {
            callback(error, response, body)
        })
    })
}
/**
 * 
 * Slack memberss list
 */
module.exports.getSlackMembers = function getSlackMembers(callback) {
    console.log("env.SLACK_ACCESS_TOKEN," + env.SLACK_ACCESS_TOKEN)
    env.request({
        url: env.Constants.SLACK_MEMBERS_LIST_URL + "" + env.SLACK_ACCESS_TOKEN,
        json: true
    }, function (error, response, body) {
        callback(error, response, body)
    })
}

/**
 * Delete vacation
 */
module.exports.deleteVacation = function deleteVacation(email, vacationId, callback) {
    env.toffyHelper.getNewSessionwithCookie(email, function (remember_me_cookie, session_Id) {
        env.toffyHelper.remember_me_cookie = remember_me_cookie
        env.toffyHelper.session_Id = session_Id


        env.request({
            url: 'http://' + env.IP + '/api/v1/vacation/' + vacationId,
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': env.toffyHelper.remember_me_cookie + ";" + env.toffyHelper.session_Id
            },
        }, function (error, response, body) {
            console.log("deleteVacation:: " + response.statusCode)
            callback(error, response, body)
        })
    })
}
/**
 * get user Id By email
 */
module.exports.getUserIdByEmail = function getUserIdByEmail(email, callback) {
    env.toffyHelper.getNewSessionwithCookie(email, function (remember_me_cookie, sessionId) {
        env.toffyHelper.general_remember_me = remember_me_cookie
        env.toffyHelper.general_session_id = sessionId

        env.request({
            url: "http://" + env.IP + "/api/v1/employee/get-id", //URL to hitDs
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': remember_me_cookie + ";" + sessionId
            },
            body: email
            //Set the body as a stringcc
        }, function (error, response, body) {
            callback(error, response, body)

        })
    });
}

/**
 * get employee balance
 */
module.exports.getEmployeeBalance = function getEmployeeBalance(Id, callback) {
    env.request({
        url: "http://" + env.IP + "/api/v1/employee/" + Id + "/balance",
        json: true,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': env.toffyHelper.general_remember_me + ";" + env.toffyHelper.general_session_id
        }
    }, function (error, response, body) {
        console.log("Response.statuse" + response.statusCode)
        console.log(" JSON.stringify(body)" + JSON.stringify(body))

        callback(error, response, body)

    })
}
/**
 * get employee History
 */
module.exports.getEmployeeHistory = function getEmployeeHistory(Id, callback) {

    var uri = 'http://' + env.IP + '/api/v1/employee/' + Id + '/vacations/2017'
    env.request({
        url: uri,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': env.toffyHelper.general_remember_me + ";" + env.toffyHelper.general_session_id
        },
    }, function (error, response, body) {
        console.log("history obeject:" + JSON.stringify(body))
        callback(error, response, body)
    })
}
/**
 * 
 * Get time pff rules
 * 
 */
module.exports.getTimeOffRules = function getTimeOffRules(email, callback) {
    env.toffyHelper.getNewSessionwithCookie(email, function (remember_me_cookie, session_Id) {
        var url = "http://" + env.IP + "/api/v1/vacation/rules";

        env.request({
            url: url,
            json: true,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': remember_me_cookie + ";" + session_Id
            }
        }, function (error, response, body) {
            callback(error, response, body)
        })
    })
}
/**
 * Get employee profile
 * 
 */
module.exports.getEmployeeProfile = function getEmployeeProfile(email, Id, callback) {
    env.toffyHelper.getNewSessionwithCookie(email, function (remember_me_cookie, session_Id) {

        env.request({
            url: "http://" + env.IP + "/api/v1/employee/" + Id,
            json: true,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': env.toffyHelper.general_remember_me + ";" + env.toffyHelper.general_session_id
            },
        }, function (error, response, body) {
            callback(error, response, body)
        })
    })
}
/**
 * 
 * 
 * Add slack record
 */
module.exports.addSlackRecord = function addSlackRecord(email, user_id, userChannelId, managerChannelId, hrChannelId, teamId, callback) {
    console.log("Adding slack ID")
    var vacationBody = {
        "email": email,
        "hrChannelId": hrChannelId,
        "managerChannelId": managerChannelId,
        "slackUserId": user_id,
        "teamId": teamId,
        "userChannelId": userChannelId

    }
    vacationBody = JSON.stringify(vacationBody)
    console.log("vacationBody" + vacationBody)
    var uri = 'http://' + env.IP + '/api/v1/toffy'
    env.request({
        url: uri, //URL to hitDs
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': env.toffyHelper.general_remember_me + ";" + env.toffyHelper.general_session_id
        },

        body: vacationBody
        //Set the body as a stringcc
    }, function (error, response, body) {
        console.log("Adding slack record" + JSON.stringify(body))
        callback(error, response, body)
    })
}
/**
 * 
 * Get all pending request for an employee
 */
module.exports.getPendingVacation = function getPendingVacation(email, Id, callback) {
    env.request({
        url: 'http://' + env.IP + '/api/v1/employee/pending-vacations?empId=' + Id,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': env.toffyHelper.general_remember_me + ";" + env.toffyHelper.general_session_id
        },
    }, function (error, response, body) {
        console.log("getPendingVacation" + JSON.stringify(body))
        callback(error, response, body)
    })


}
/**
 * get all sick vacation for employee that need report
 */
module.exports.getSickVacationNeedReport = function getSickVacationNeedReport(email, Id, callback) {
    env.request({
        url: 'http://' + env.IP + '/api/v1/employee/' + Id + '/vacation-report',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': env.toffyHelper.general_remember_me + ";" + env.toffyHelper.general_session_id
        },
    }, function (error, response, body) {
        console.log("getPendingVacation" + JSON.stringify(body))
        callback(error, response, body)
    })


}
/**
 * 
 * Get holidays
 */
module.exports.getHolidays = function getHolidays(email, date, date1, callback) {
    env.toffyHelper.getNewSessionwithCookie(email, function (remember_me_cookie, session_Id) {
        env.request({
            url: 'http://' + env.IP + '/api/v1/holidays/range?from=' + date + '&to=' + date1,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': remember_me_cookie + ";" + session_Id
            },
        }, function (error, response, body) {
            callback(error, response, body)
        })
    })
}
/**
 * 
 * Get working days for an employye time off
 */
module.exports.getWorkingDays = function getWorkingDays(vacationBody, callback) {
    env.request({
        url: "http://" + env.IP + "/api/v1/vacation/working-days", //URL to hitDs
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': env.toffyHelper.general_remember_me + ";" + env.toffyHelper.general_session_id
        },
        body: vacationBody
        //Set the body as a stringcc
    }, function (error, response, body) {
        console.log("getWorkingDays" + JSON.stringify(body))
        callback(error, response, body)
    })


}
/**
 * Get pendingrequest 
 */
module.exports.setSendFlagForManager = function setSendFlagForManager(approvalId, callback) {
    var url = 'http://' + env.IP + '/api/v1/vacation/send-manager-approval/' + approvalId
    console.log("setSendFlagForManager utl:" + url)
    env.request({
        url: url,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': env.toffyHelper.general_remember_me + ";" + env.toffyHelper.general_session_id
        },
    }, function (error, response, body) {
        callback(error, response, body)
    })

}
