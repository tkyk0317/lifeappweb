var express = require('express');
var router = express.Router();

//------------------------------------.
// Signout API.
//------------------------------------.
router.get('/', (req, res, next) => {
    console.log("Signout: " + req.session.user);
    if(req.session.user !== undefined && req.session.user !== null) {
        // delete session.
        req.session.user = null;
        res.redirect('signin');
    }
    else {
        res.json({error: "not login"});
    }
});

module.exports = router;
