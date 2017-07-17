const request = require('request');
var toffyHelper = require('.././toffyHelper.js')
var server = require('.././server.js')
var sessionFlag = 0;
var IP = process.env.SLACK_IP
/**
 * Genereta the approvers section when send the time off to them ,so any approvel can check the other approvels action
 */
module.exports.generateManagerApprovelsSection = function generateManagerApprovelsSection(managerApproval, managerEmail, type, sickReportFlag, callback) {

    var i = 0
    var size = Object.keys(managerApproval).length
    var messageBody = "\""
    if (type == "WFH") {
        callback(messageBody)
    } else {


        //Sorting Managers Approver based on rank
        managerApproval.sort(function (a, b) {
            return a.rank - b.rank;
        });
        while (i < size) {
            var flag = "true }"
            if ((i + 1) == size) {
                flag == "false }"
            }
            var arr = managerApproval[i].managerEmail.toString().split("@")
            if (managerApproval[i].managerEmail != managerEmail && managerApproval[i].type != "HR" || managerApproval[i].managerEmail != managerEmail && managerApproval[i].type == "HR" && sickReportFlag == true) {


                messageBody = messageBody + "{" + "\"title\":" + "\"" + "Approver ( " + arr[0] + " )\"" + ",\"value\":" + "\"" + managerApproval[i].state + "" + "\"" + ",\"short\":" + flag
                messageBody = messageBody + ","
            }

            i++
        }

        callback(messageBody)
    }
}
module.exports.generateYourActionSection = function generateYourActionSection(managerApproval, managerEmail, callback) {
    var i = 0
    var size = Object.keys(managerApproval).length
    var messageBody = ""
    //Sorting Managers Approver based on rank
    managerApproval.sort(function (a, b) {
        return a.rank - b.rank;
    });
    while (i < size) {
        var flag = true
        if (managerApproval[i].managerEmail == managerEmail) {

            messageBody = "{" + "\"title\":" + "\"" + "Your Action " + "\"" + ",\"value\":" + "\"" + managerApproval[i].state + ":thinking_face:" + "\"" + ",\"short\":true }"

        }

        i++
    }
    callback(messageBody)

}
