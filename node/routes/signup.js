var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var jsSHA = require('jssha');
var models = require('../models');
var utility = require(__dirname + '/../public/javascripts/utility');

var app = express();
var bodyParser = require('body-parser');

// initialize.
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//------------------------------------.
// render signup.
//------------------------------------.
router.get('/', (req, res, next) => {
    res.render('signup', {title: 'Signup'});
});

//------------------------------------.
// signup api.
//------------------------------------.
router.post('/', (req, res, next) => {
    // insert record.
    const insertRecord = (params) => {
        return new Promise((resolve, reject) => {
            // encrypt password.
            let sha256 = new jsSHA("SHA-256", "TEXT");
            sha256.update(params.password);
            const password = sha256.getHash("HEX");

            // find or create(if not exists).
            models.Member.findOrCreate({
                where: {email: params.email},
                defaults: {
                    firstname: params.firstname,
                    lastname: params.lastname,
                    email: params.email,
                    password: password,
                },
            })
            .spread((member, created) => {
                if(!created) reject("Account is already exists");
                else resolve();
            });
        });
    };

    // render error page.
    const renderError = (e) => {
        res.render('signup', {title: 'Signup', error: e});
    };

    // sequence prosess.
    insertRecord(req.body)
        .then(
            () => {
                res.render('signup_complete', {title: 'Signup Complete'});
            },
            (e) => {
                renderError(e);
            }
        )
        .catch((e) => {
            renderError(e);
        });
});

module.exports = router;
