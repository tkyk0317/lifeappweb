var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var jsSHA = require('jssha');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// for mysql.
const connection = mysql.createConnection({
    host: 'database',
    user: 'albio',
    password: 'albio',
    database: 'lifeapp'
});

// for json.
var app = express();
var bodyParser = require('body-parser');

// initialize.
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//-------------------------------------.
// authentication function.
//-------------------------------------.
passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
    },
    (req, user, passwd, done) => {
        process.nextTick(() => {
            const encrypted_password = getHash(req.body.password);
            const email = req.body.email;

            // search user record.
            connection.query({
                sql: 'select * from member where email = ? and password = ?',
                values: [email, encrypted_password]
            }, (e, r, f) => {
                if(e || !r) {
                    req.flash('error', e);
                    done(e);
                }
                else if(r.length < 1) {
                    req.flash('error', 'Please enter the correct email and password');
                    req.flash('email', email);
                    done(null, false);
                }
                else done(null, r[0].id);
            });
        });
    }));

// save session.
passport.serializeUser(function(id, done) {
    done(null, id);
});

// delete session.
passport.deserializeUser(function(id, done) {
    done(null, id);
});

//-------------------------------------.
//  get hash string.
//-------------------------------------.
const getHash = (d) => {
    let sha256 = new jsSHA("SHA-256", "TEXT");
    sha256.update(d);
    return sha256.getHash("HEX");
};

//------------------------------------.
// render signin.
//------------------------------------.
router.get('/', (req, res, next) => {
    res.render('signin', {title: 'Signin', email: req.flash('email')[0], error: req.flash('error')[0]});
});

//------------------------------------.
// signin api.
//------------------------------------.
router.post('/',
            passport.authenticate('local',
                                  {
                                      successRedirect: '/',
                                      failureRedirect: '/signin',
                                      failureFlash: true,
                                      session: true,
                                  })
           );

module.exports = router;
