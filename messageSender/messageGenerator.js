const request = require('request');
var toffyHelper = require('.././toffyHelper.js')
var server = require('.././server.js')
var sessionFlag = 0;
var IP = process.env.SLACK_IP
/**
 * Genereta the approvers section when send the time off to them ,so any approvel can check the other approvels action
 */
module.exports.generateManagerApprovelsSection = function generateManagerApprovelsSection(managerApproval, callback) {
    console.log("generateManagerApprovelsSection" + JSON.stringify(managerApproval))
    console.log("generateManagerApprovelsSection" + managerApproval[0].state)
    var i = 0
    var size = Object.keys(managerApproval).length
    var messageBody = ""
    managerApproval.sort(function (a, b) {
        return a.rank - b.rank;
    });
    while (i < size) {
        var flag = true
        if ((i + 1) == size) {
            flag == false
        }
        messageBody = messageBody + "{" + "\"title\":" + "\"" + "Approver " + (i + 1) + "\"" + ",\"value\":" + "\"" + managerApproval[0].state + "\"" + ",\"short\":" + flag + "}"
        messageBody = messageBody + ","
        i++
    }
    console.log("arrive1" + messageBody)
    var stringfy = JSON.stringify(messageBody)
    console.log("arrive2" + stringfy)

    stringfy = stringfy.replace(/\\/g, "")
    stringfy = stringfy.replace(/}\"/, "}")
    stringfy = stringfy.replace(/\"\{/, "{")
    // stringfy = JSON.parse(stringfy)
    console.log("arrive3" + stringfy)
    callback(stringfy)








}