'use strict'



var APIAI_ACCESS_TOKEN = process.env.APIAI_ACCESS_KEY
exports.APIAI_ACCESS_TOKEN = APIAI_ACCESS_TOKEN;

const express = require('express')
exports.express = express;

const Slapp = require('slapp')
exports.Slapp = Slapp

const BeepBoopConvoStore = require('slapp-convo-beepboop')

const BeepBoopContext = require('slapp-context-beepboop')

const bodyParser = require('body-parser');
exports.bodyParser = bodyParser

const uuid = require('node-uuid');
exports.uuid = uuid

const request = require('request');
exports.request = request

const JSONbig = require('json-bigint');
exports.JSONbig = JSONbig

const async = require('async');
exports.async = async

const apiai = require('apiai');

var leave = require('.././leave.js')
exports.leave = leave

var toffyHelper = require('.././toffyHelper')
exports.toffyHelper = toffyHelper

var employee = require('.././employee.js');
exports.employee = employee

var server = require('.././server.js')
exports.server = server
const mRequests = require('.././Requests/Requests.js')
exports.mRequests = mRequests
var stringFile = require('.././strings.js')
exports.stringFile = stringFile

const vacationWithLeave = require('.././VacationEngine/VacationWithLeave.js')
exports.vacationWithLeave = vacationWithLeave

const messageSender = require('.././messageSender/messageSender.js')
exports.messageSender = messageSender

const messageReplacer = require('.././messageSender/messageReplacer.js')
exports.messageReplacer = messageReplacer

const messageGenerator = require('.././messageSender/messageGenerator.js')
exports.messageGenerator = messageGenerator

const vacationOverllaping = require('../././VacationOverllaping/overlappedVacations.js')
exports.vacationOverllaping = vacationOverllaping

const dateHelper = require('.././DateEngine/DateHelper.js')
exports.dateHelper = dateHelper;

var apiAiService = apiai(APIAI_ACCESS_TOKEN);
exports.apiAiService = apiAiService

var IP = process.env.SLACK_IP;
exports.IP = IP

var sickFlag = "";
exports.sickFlag = sickFlag
var typeOfVacation = "";
exports.typeOfVacation = typeOfVacation
var fromDate = ""
exports.fromDate = exports
var toDate = "";
exports.toDate = toDate

var generalMsg = "";
exports.generalMsg = generalMsg
var salesforceCode = "";
var leaveFlag = "";
var count = 0;
var state = "init"
var session = "";
var token = "";
var generalId = "";
const APIAI_LANG = 'en';
const opn = require('opn');
var sessionId = uuid.v1();
var requestify = require('requestify');
var pg = require('pg');
var Constants = require('.././Constants.js');
var APIAI_ACCESS_TOKEN = process.env.APIAI_ACCESS_KEY;
var SLACK_ACCESS_TOKEN = process.env.SLACK_APP_ACCESS_KEY;
var SLACK_BOT_TOKEN = process.env.SLACK_BOT_ACCESS_KEY;
var SLACK_HR_TOKEN = process.env.SLACK_HR_ACCESS_KEY;
var SLACK_EMPLOYEE_BOT_ACCESS_KEY = process.env.SLACK_EMPLOYEE_BOT_ACCESS_KEY

exports.count = count;
pg.defaults.ssl = true;

if (!process.env.PORT) throw Error('PORT missing but required')
var slapp = Slapp({
    convo_store: BeepBoopConvoStore(),
    context: BeepBoopContext()
})
var Botkit = require('.././lib/Botkit.js');
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
//
var controller2 = Botkit.slackbot({
    debug: true,
});
var employeeBot = controller2.spawn({
    token: SLACK_EMPLOYEE_BOT_ACCESS_KEY

}).startRTM();
exports.employeeBot = employeeBot
