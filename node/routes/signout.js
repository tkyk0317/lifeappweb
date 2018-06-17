var express = require('express');
var router = express.Router();

//------------------------------------.
// Signout API.
//------------------------------------.
router.get('/', (req, res, next) => {
    req.logout();
    res.redirect('signin');
});

module.exports = router;
