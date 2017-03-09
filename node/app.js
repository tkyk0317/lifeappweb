var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var app = express();
var passport = require('passport');
var flash = require('connect-flash');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jsx');
app.engine('jsx', require('express-react-views').createEngine());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//-----------------------------------.
// Configuration Session.
//-----------------------------------.
app.use(session({
    secret: 'lifeapp',
    resave: false,
    saveUninitialized :false,
    cookie: {
        maxAge: 1000 * 60 * 60, // mill-seconds.
    }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// check authentication.
app.use((req, res, next) => {
    if(req.user) {
        // already logined.
        next();
    }
    else {
        switch(req.url) {
        case '/':
            // need logined.
            res.redirect('signin');
            break;
        default:
            // not need logined.
            next();
            break;
        }
    }
});

//-----------------------------------.
// routing.
//-----------------------------------.
app.use('/', require('./routes/index'));
app.use('/signin', require('./routes/signin'));
app.use('/signup', require('./routes/signup'));
app.use('/signout', require('./routes/signout'));
app.use('/v1/schedules', require('./routes/api/v1/schedules'));
app.use('/auth/google', require('./routes/google_signin'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

app.listen(3000);
module.exports = app;
