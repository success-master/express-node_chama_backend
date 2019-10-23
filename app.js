const express = require('express');
const path = require('path');
var cors = require('cors');

const Transaction = require('./modules/transactions/router.js');

require('./config/db_connection.js');
require('./config/passport.js');

var passport = require('passport');
var bodyParser = require('body-parser');
const app = express();

app.use(cors())

var cookieParser = require('cookie-parser');

app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));

app.use(cookieParser());

// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json 
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/transactions', Transaction);


// error handlers
// Catch unauthorised errors
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      res.status(401);
      res.json({"message" : err.name + ": " + err.message});
    }
});

// web server 8080

app.listen(8886, () => console.log('-- [ CHAMA PLUS NODE ] SERVER STARTED LISTENING ON PORT 8886 --'));
