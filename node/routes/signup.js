var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var jsSHA = require('jssha');
var utility = require(__dirname + '/../public/javascripts/utility');

const connection = mysql.createConnection({
    host: 'database',
    user: 'albio',
    password: 'albio',
    database: 'lifeapp'
});

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
    const params = req.body;

    // check account is exists.
    const isExistAccount = () => {
        return new Promise((resolve, reject) => {
            connection.query({
                sql: 'select * from member where email = ?',
                values: [params.email]
            }, (e, r, f) => {
                if(e || !r) reject("Database error: " + e); // db error.
                else if(r.length > 1) reject("Account is already exists"); // already exists.
                else resolve(); // success.
            });

        });
    };

    // insert record.
    const insertRecord = () => {
        return new Promise((resolve, reject) => {
            // encrypt password.
            let sha256 = new jsSHA("SHA-256", "TEXT");
            sha256.update(params.password);
            const password = sha256.getHash("HEX");

            // insert record.
            const now = new Date();
            const date_str = utility.toDateString(now) + " " + utility.toTimeString(now);
            connection.query({
                sql: 'insert into member values(null, ?, ?, ?, ?, ?, ?)',
                values: [params.firstname, params.lastname, params.email, password, date_str, date_str]
            }, (e, f) => {
                if (e) reject("Database error: " + e); // error.
                else resolve();  // success.
            });
        });
    };

    // render error page.
    const renderError = (e) => {
        res.render('signup', {title: 'Signup', error: e});
    };

    // sequence prosess.
    Promise.resolve()
        .then(isExistAccount, renderError)
        .then(insertRecord, renderError)
        .then(() => {
            // success.
            res.render('signup_complete', {title: 'Signup Complete'});
        }, renderError)
        .catch(renderError);
});

module.exports = router;
