var express = require('express');
var router = express.Router();
var jsSHA = require('jssha');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var models = require('../models');

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
            models.Member.findOne({
                where: {email: email, password: encrypted_password},
            })
            .then((member) => {
                if(member) done(null, member);
                else {
                    req.flash('error', 'Please enter the correct email and password');
                    done(null, false);
                }
            })
            .catch((e) => {
                console.log(e);
                done(e);
            });
        });
    }));

// save session.
passport.serializeUser(function(user, done) {
    done(null, user);
});

// delete session.
passport.deserializeUser(function(user, done) {
    done(null, user);
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
