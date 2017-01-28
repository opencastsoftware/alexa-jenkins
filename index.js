'use strict';
var Alexa = require('alexa-sdk');
var request = require('request')

var APP_ID = undefined; //OPTIONAL: replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";
var SKILL_NAME = 'jenkins';

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.emit('GetFact');
    },
    'DoJenkinsBuildIntent': function () {
        var self = this

        var jenkinsJob = this.event.request.intent.slots.JenkinsJob.value

        request.post(`http://139.59.182.20:8080/job/${jenkinsJob}/build?token=cheese`).auth("steve", "kitano").on("response", function(response) {
            if (response.statusCode == 201) {
                var url = response.headers["location"]
                console.log(response)
                var buildNumber = /([\d]+)\/$/.exec(url)[1]
                self.emit(':tellWithCard', "AWESOME, kicked off jenkins build " + buildNumber, SKILL_NAME)
            }
            else {
                self.emit(':tellWithCard', "BOOOOOO", SKILL_NAME)
            }
        })
    }
};