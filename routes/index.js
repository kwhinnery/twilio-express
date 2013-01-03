var twilio = require('twilio');

//Get Twilio config
var config = {};

//prod/heroku
if (process.env.ACCOUNT_SID) {
    config.accountSid = process.env.ACCOUNT_SID;
    config.authToken = process.env.AUTH_TOKEN;
}

//local dev
else {
    config = require('config');
}

exports.index = function (req, res) {
    res.render('index', { title:'Express' });
};

exports.twiml = function(req, res) {
    if (twilio.validateExpressRequest(req, config.authToken)) {
        var resp = new twilio.TwimlResponse();
        resp.say('express sez - hello twilio!');

        res.type('text/xml');
        res.send(resp.toString());
    }
    else {
        res.send('you are not twilio.  Buzz off.');
    }
};