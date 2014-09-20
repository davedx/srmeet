var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');

app.use(bodyParser.json())

app.get('/', function (req, res) {
	res.send('Hello World');
});

app.get('/profiles', function (req, res) {
	console.log("Responding to /profiles");

	var collection = app.db.collection('profiles');
	collection.find().toArray(function(err, results) {
		console.dir(results);
		// Let's close the db
		res.send(results);
	});

});

app.post('/profiles/new', function (req, res) {
	
	var profile = req.body;
	console.log('Adding profile: ', profile);

	app.db.collection('profiles', function(err, collection) {
		collection.insert(profile, {safe:true}, function(err, result) {
			if (err) {
				res.send({'error':'An error has occurred'});
			} else {
				console.log('Success: ' + JSON.stringify(result[0]));
				res.send(result[0]);
			}
		});
	});

});

MongoClient.connect('mongodb://127.0.0.1:27017/sameet', function(err, db) {
	if(err) throw err;
	app.db = db;

	app.listen(3000, '10.10.0.103');
});

	//	db.close();
//