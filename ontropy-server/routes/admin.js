var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {

	var Level = require('../app/model/level').Level;

	Level.find({}, function (err, docs) {

		res.render("admin", {
        	levels: docs, 
    	});
	});

    
});

module.exports = router;
