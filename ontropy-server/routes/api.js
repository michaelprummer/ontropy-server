var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/read', function(req, res) {


	var Level = require('../app/model/level').Level;

	Level.find({}, function (err, docs) {
		if (err) throw err;
        res.contentType('application/json');
        res.write(JSON.stringify(docs));
        res.end();

	});
});



module.exports = router;
