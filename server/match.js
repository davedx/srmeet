var ObjectID = require('mongodb').ObjectID;

var setRoutes = function(app) {
	// Get all matches for profile ID.
	app.get('/matches/:id', function (req, res) {
		console.log("Responding to /profiles");
		var userId = ObjectID(req.params.id);

		var collection = app.db.collection('matches');
		collection.find({$or: [{user1: userId}, {user2: userId}]}).toArray(function(err, results) {
			res.send(results);
		});
	});

	// User1 likes User2
	app.post('/matches/:id/new', function (req, res) {
		var userId = ObjectID(req.params.id);
		var data = req.body;
		var targetUser = ObjectID(data.id);

		console.log('Adding match: ', data);

		var addMatch = function() {
			app.db.collection('matches', function(err, collection) {
				collection.insert({user1: userId, user2: targetUser}, {safe:true}, function(err, result) {
					if (err) {
						res.send({'error':'Error creating new match'});
					} else {
						console.log('Success: ' + JSON.stringify(result[0]));
						res.send(result[0]);
					}
				});
			});			
		};

		app.db.collection('matches').find({user1: userId, user2: targetUser}).toArray(function(err, results) {
			if(err) {
				res.send({result: "CANNOT_CHECK_FOR_EXISTING_MATCHES"});
			} else if(results.length !== 0) {
				res.send({result: "ALREADY_LIKED"});
			} else {
				addMatch();
			}
		});
	});
};

module.exports = setRoutes;
