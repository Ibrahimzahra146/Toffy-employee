const request = require('request');
var toffyHelper = require('.././toffyHelper.js')
var server = require('.././server.js')
var sessionFlag = 0;
var IP = process.env.SLACK_IP
/**
 * Genereta the approvers section when send the time off to them ,so any approvel can check the other approvels action
 */
module.exports.generateManagerApprovelsSection = function generateManagerApprovelsSection(managerApproval, managerEmail, callback) {

    var i = 0
    var size = Object.keys(managerApproval).length
    var messageBody = ""
    //Sorting Managers Approver based on rank
    managerApproval.sort(function (a, b) {
        return a.rank - b.rank;
    });
    while (i < size) {
        var flag = true
        if ((i + 1) == size) {
            flag == false
        }
        if (managerApproval[i].email != managerEmail) {

            messageBody = messageBody + "{" + "\"title\":" + "\"" + "Approver " + (i + 1) + "\"" + ",\"value\":" + "\"" + managerApproval[i].state + "\"" + ",\"short\":" + flag + "}"
            messageBody = messageBody + ","
        }

        i++
    }
    var stringfy = JSON.stringify(messageBody)


    stringfy = stringfy.replace(/\\/g, "")
    stringfy = stringfy.replace(/}\"/, "}")
    stringfy = stringfy.replace(/\"\{/, "{")
    callback(stringfy)








}