var express = require('express');
var router = express.Router();
var google = require('./google.js');
var models = require('../../../models/');

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
            models.Member.findOne({id: id})
                .then((r) => {
                    resolve({
                        id: r.id,
                        firstname: r.firstname,
                        lastname: r.lastname,
                        email: r.email,
                        avatar: r.avatar,
                    });
                })
                .catch((e) => {
                    reject(e);
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
