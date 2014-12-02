var express = require('express');
var router = express.Router();
var Level = require('../app/model/level').Level;

/* GET all levels */
router.get('/read', function(req, res) {

	Level.find({}, function (err, docs) {
		if (err) throw err;
        res.contentType('application/json');
        res.write(JSON.stringify(docs));
        res.end();

	});
});

//get single level by id
router.get('/read/:lvlId', function(req, res) {

	//TODO: SANITIZE INPUT! 
  	if (req.checkParams('lvlId', 'Invalid urlparam').isAlpha()){
  		console.log("not alpha");
  	}
	var lvlId = req.params.lvlId;
 	req.sanitize('lvlId').toString();

	if ( lvlId != undefined) {
		//creates alphanumeric string from input
		console.log(lvlId);
		var lvlQuery = { "_id" : lvlId};
	
		//query db for lvl
		Level.findOne(lvlQuery, function (err, docs) {
			if (err) throw err;
	        res.contentType('application/json');
	        res.write(JSON.stringify(docs));
	        res.end();
		});
	}
});

//save new level
router.post('/create', function(req, res) {

	//TODO: SANITIZE INPUT! 
	var newLvl = req.body;

	Level.create(newLvl,
		function(err, elem) {
			if (err) throw err;
			res.contentType('application/json');
        	res.write(JSON.stringify(elem));
        	res.end();
	});
});





module.exports = router;
