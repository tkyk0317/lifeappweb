var express = require('express');
var router = express.Router();
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth2').Strategy;

// for json.
var app = express();
var bodyParser = require('body-parser');

// initialize.
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//-----------------------------------.
// google oauth2 configuration.
//-----------------------------------.
passport.use(
    new GoogleStrategy(
        {
            clientID: '546592957711-hcj7ou2imh6f3f4f13eh5j0619p4i7u5.apps.googleusercontent.com',
            clientSecret: 'klxyxpTc-XMOZbS9uLzAFVGA',
            callbackURL: process.env.CALLBACK_URL,
            passReqToCallback: true,
        },
        (req, accessToken, refreshToken, profile, done) => {
            profile.accessToken = accessToken;
            if(profile) return done(null, profile);
            return done(null, null);
        })
);

// save session.
passport.serializeUser((user, done) => {
    done(null, user);
});

// delete session.
passport.deserializeUser((user, done) => {
    done(null, user);
});

//-----------------------------------.
// Get Google Login API.
//-----------------------------------.
router.get('/', passport.authenticate('google',
                                      {
                                          scope:
                                          [
                                              'profile',
                                              'email',
                                              'https://www.googleapis.com/auth/calendar',
                                          ],
                                      }));
// redirect from google.
router.get('/callback', passport.authenticate('google',
                                              {
                                                  successRedirect: '/',
                                                  failureRedirect: '/auth/google'
                                              })
          );

module.exports = router;
