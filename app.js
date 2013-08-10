/**
 * Module dependencies.
 */

var express = require('express'),
    http = require('http'),
    path = require('path'),
    twilio = require('twilio');

var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function () {
    app.use(express.errorHandler());
});

//Twilio goodness
var config = {};

//prod/heroku
if (process.env.ACCOUNT_SID) {
    config.accountSid = process.env.ACCOUNT_SID;
    config.authToken = process.env.AUTH_TOKEN;
}

//local dev
else {
    config = require('./config');
}

//Quick Start Example 1 - Make an outbound call
function qs1(request, response) {
    var capability = new twilio.Capability(config.accountSid, config.authToken);

    //This is a TwiML app SID configured with a voice URL
    //https://www.twilio.com/user/account/apps
    capability.allowClientOutgoing('APd0aa702e9a16856c36d4476075cc212c');

    // Render an EJS template with the token and page title in context
    // EJS template is found in views/qs1.ejs
    response.render('qs1', {
        title:'Hello Monkey 1',
        token:capability.generate()
    });
}
app.get('/', qs1);
app.get('/qs1', qs1);

//Quick Start Example 2 - Hang up a call
app.get('/qs2', function(request, response) {
    var capability = new twilio.Capability(config.accountSid, config.authToken);
    capability.allowClientOutgoing('APd0aa702e9a16856c36d4476075cc212c');

    response.render('qs2', {
        title:'Hello Monkey 2',
        token:capability.generate()
    });
});

//Quick Start Example 3 - Accept an incoming call
app.get('/qs3', function(request, response) {
    var capability = new twilio.Capability(config.accountSid, config.authToken);
    capability.allowClientOutgoing('APd0aa702e9a16856c36d4476075cc212c');
    capability.allowClientIncoming('jenny');

    response.render('qs3', {
        title:'Hello Monkey 3',
        token:capability.generate()
    });
});

//Quick Start Example 4 - Make outgoing calls from the browser
app.get('/qs4', function(request, response) {
    var capability = new twilio.Capability(config.accountSid, config.authToken);
    capability.allowClientOutgoing('APd0aa702e9a16856c36d4476075cc212c');
    capability.allowClientIncoming('jenny');

    response.render('qs4', {
        title:'Hello Monkey 4',
        token:capability.generate()
    });
});

//Twilio request authentication
app.post('/twiml', function(req, res) {
    if (twilio.validateExpressRequest(req, config.authToken)) {
        var resp = new twilio.TwimlResponse();
        resp.say('express sez - hello twilio!');

        res.type('text/xml');
        res.send(resp.toString());
    }
    else {
        res.send('you are not twilio.  Buzz off.');
    }
});

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
