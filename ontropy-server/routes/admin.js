var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {

	var Level = require('../app/model/level').Level;

	/*
		Level.create({
	    name : "testREst",
	    content: "123123123123",
	  }, function(err, team) {
	    console.log("dun goofd");
	  });
	*/


	Level.find({}, function (err, docs) {

		res.render("admin", {
        	levels: docs, 
    	});
	});

    
});

module.exports = router;
