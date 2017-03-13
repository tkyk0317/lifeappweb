var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var google = require('./google.js');

// configuration database.
const connection = mysql.createConnection({
    host: 'database',
    user: 'albio',
    password: 'albio',
    database: 'lifeapp'
});

//---------------------------------------.
// Profile Factory.
//---------------------------------------.
class ProfileFactory {
    static create(user) {
        return google.isGoogle(user) ? new GoogleProfile(user) : new Profile;
    }
}

//---------------------------------------.
// Profile Class.
//---------------------------------------.
class Profile {
    constructor() {}

    // get profile.
    getProfile(id) {
        return new Promise((resolve, reject) => {
            connection.query({
                sql: 'select * from member where id = ?',
                values: [id],
            }, (e, r, f) => {
                if(e || !r) reject("Database Error");
                else resolve({
                    id: r[0].id,
                    firstname: r[0].firstname,
                    lastname: r[0].lastname,
                    email: r[0].email,
                    avator: r[0].avator,
                });
            });
        });
    }
}

//---------------------------------------.
// Google Profile Class.
//---------------------------------------.
class GoogleProfile extends Profile {
    constructor(user) {
        super();
        this.user = user;
    }

    // get profile.
    getProfile(id) {
        let user = this.user;
        return new Promise((resolve, reject) => {
            if(user)
                resolve({
                    id: user.id,
                    firstname: user.name.familyName,
                    lastname: user.name.givenName,
                    email: user.email,
                    avator: user.photos[0].value,
                });
            else reject("this.user is null");
        });
    }
}

//---------------------------------------.
// Profile API.
//---------------------------------------.
router.get('/:id', (req, res) => {
    let profile = ProfileFactory.create(req.user);
    profile.getProfile(req.params.id)
        .then((d) => {
            res.json(d);
        })
        .catch((e) => {
            console.log(e);
        });
});

module.exports = router;
