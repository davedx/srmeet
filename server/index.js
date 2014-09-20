var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');
var profile = require("./profile");
var match = require("./match");

app.use(bodyParser.json());

app.get('/', function (req, res) {
	res.send('Hello World');
});

profile(app);
match(app);

MongoClient.connect('mongodb://127.0.0.1:27017/sameet', function(err, db) {
	if(err) throw err;
	app.db = db;

	app.listen(3000, '10.10.0.103');
});
