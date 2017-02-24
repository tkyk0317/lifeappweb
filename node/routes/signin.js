var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var jsSHA = require('jssha');

const connection = mysql.createConnection({
    host: 'database',
    user: 'albio',
    password: 'albio',
    database: 'lifeapp'
});

//------------------------------------.
// render signin.
//------------------------------------.
router.get('/', (req, res, next) => {
    res.render('signin', {title: 'Signin'});
});

var app = express();
var bodyParser = require('body-parser');

// initialize.
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//------------------------------------.
// signin api.
//------------------------------------.
router.post('/', (req, res, next) => {
    const searchRecord = (email, password) => {
        return new Promise((resolve, reject) => {
            connection.query({
                sql: 'select * from member where email = ? and password = ?',
                values: [email, password]
            }, (e, r, f) => {
                if(e || !r) reject("Database error: " + e);
                else if(r.length < 1) reject("Please enter the correct email and password");
                else resolve(r[0].id);
            });
        });
    };

    // search record.
    let sha256 = new jsSHA("SHA-256", "TEXT");
    sha256.update(req.body.password);
    searchRecord(req.body.email, sha256.getHash("HEX"))
        .then(
            (id) => {
                // save login info into session.
                req.session.user = {id: id};
                res.redirect(302, '/');
            },
            (e) => {
                res.render('signin', {title: 'Signin', error: e, email: req.body.email});
            }
        );
  });

  module.exports = router;
