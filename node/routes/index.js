var express = require('express');
var router = express.Router();

//----------------------------------.
// Render Top Page.
//----------------------------------.
router.get('/', (req, res, next) => {
  res.render('index', {title: 'Lifeapp'});
});

module.exports = router;
