var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');
var profile = require("./profile");
var match = require("./match");
var chat = require("./chat");

app.use(bodyParser.json());

app.get('/', function (req, res) {
	res.send('Hello World');
});

profile(app);
match(app);
chat(app);

MongoClient.connect('mongodb://127.0.0.1:27017/sameet', function(err, db) {
	if(err) throw err;
	app.db = db;

	var ip = process.argv[2];
	console.log("Binding to "+ip+":3000");
	app.listen(3000, ip);
});
