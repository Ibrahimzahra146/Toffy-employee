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
    while (i < size) {
        messageBody = messageBody + "{" + "\"title\":" + "\"" + "Approver " + i + "\"" + ",\"value\":" + "\"" + managerApproval[0].state + "\"" + ",\"short\":true}"
        messageBody = messageBody + ","
        i++
    }
    var stringfy = JSON.stringify(messageBody);


    stringfy = stringfy.replace(/\\/g, "")
   
    stringfy = JSON.parse(stringfy)
    callback(stringfy)








}