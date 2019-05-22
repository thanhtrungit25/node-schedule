const fs = require('fs');
const config = require('config');
const express = require('express');
const https = require('https');
const bodyParse = require('body-parser');
const FB = require('fb');
const Session = require('express-session');
const FileStore = require('session-file-store')(Session);
const passport = require('./auth/passport');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');

const options = {
  key: fs.readFileSync(__dirname + '/certs/key.pem'),
  cert: fs.readFileSync(__dirname + '/certs/cert.pem')
};

const port = 8888;

FB.options({
  appId: config.get('appId'),
  appSecret: config.get('appSecret')
});

const app = express();
mongoose.connect('mongodb://127.0.0.1/nodeFB');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use('/src', express.static(__dirname + '/public'));
app.use('/media', express.static(__dirname + '/media'));
app.use(fileUpload());
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(bodyParse.urlencoded({ extended: true }));
app.use(bodyParse.json());
app.use(
  Session({
    store: new FileStore(),
    secret: config.get('sessionSecret'),
    resave: true,
    saveUninitialized: true
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/', require('./routes/scheduler'));
app.use('/login', require('./routes/login'));

app.get('/', function(req, res) {
  res.render('app', { user: req.user });
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

https.createServer(options, app).listen(port, function() {
  console.log('Express server listening on port ' + port);
});
