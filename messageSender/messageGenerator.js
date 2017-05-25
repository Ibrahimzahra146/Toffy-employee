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
    console.log("generateManagerApprovelsSection" + managerApproval)
    var i = 0
    console.log("Object.keys(obj).lengths" + Object.keys(managerApproval).length)





}