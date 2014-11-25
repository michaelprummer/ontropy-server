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
	var lvlQuery = (req.params.lvlId != undefined) ? { "_id" : req.params.lvlId } : {} ;

	Level.findOne(lvlQuery, function (err, docs) {
		if (err) throw err;
        res.contentType('application/json');
        res.write(JSON.stringify(docs));
        res.end();
	});
});

//save new level
router.post('/create', function(req, res) {

	//TODO: SANITIZE INPUT! 
	var newLvl = req.body;
	console.log(newLvl);

	Level.create({
			name : newLvl.name ,
			content: newLvl.content
		},
		function(err, elem) {
			if (err) throw err;
			//console.log("Saved level " + elem);
			res.contentType('application/json');
        	res.write(JSON.stringify(elem));
        	res.end();
	});
});





module.exports = router;
