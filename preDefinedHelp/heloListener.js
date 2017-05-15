var APIAI_ACCESS_TOKEN = process.env.APIAI_ACCESS_KEY
const express = require('express')
const Slapp = require('slapp')
const BeepBoopConvoStore = require('slapp-convo-beepboop')
const BeepBoopContext = require('slapp-context-beepboop')
const bodyParser = require('body-parser');
const uuid = require('node-uuid');
const request = require('request');
var slapp = Slapp({
  convo_store: BeepBoopConvoStore(),
  context: BeepBoopContext()
})
var app = slapp.attachToExpress(express())
slapp.action('preDefinedHelp', 'Show_stats', (msg, value) => {
    console.log("SHOW stats listenerr")
})
app.listen(3000)
