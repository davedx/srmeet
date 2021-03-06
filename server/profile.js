var schiphol = require('./schiphol');
var ObjectID = require('mongodb').ObjectID;

var setRoutes = function(app) {
	// Get all profiles.
	// TODO: filter data based on user's prefs (hidden fields)
	app.get('/profiles', function (req, res) {
		console.log("Responding to /profiles");

		var collection = app.db.collection('profiles');
		collection.find().toArray(function(err, results) {
			console.dir(results);
			// Let's close the db
			res.send(results);
		});
	});

	// get a user profile
	app.delete('/profiles/:id', function (req, res) {
		console.log("Responding to delete on /profiles/:id");

		var collection = app.db.collection('profiles');
		collection.remove({_id: ObjectID(req.params.id)},{justOne: true},function(err, results) {
			res.send(results);
		});
	});

	app.get('/profiles/:id', function(req,res){
		console.log("Responding to /profiles/:id");

		var collection = app.db.collection('profiles');
		collection.findOne({_id: ObjectID(req.params.id)}, function(err, results) {
			res.send(results);
		});
	});

	var getUserFromFacebookUserId = function(userId, callback) {
		var collection = app.db.collection('profiles');
		collection.findOne({"profile.fb_user_id": userId}, callback);
	};

	// get a user profile by their Facebook user ID.
	app.get('/profiles/facebook/:id', function (req, res) {
		console.log("Responding to /profiles/facebook/" + req.params.id);
		getUserFromFacebookUserId(req.params.id, function(err, results) {
			res.send(results);
		});
	});

	// Create a new profile, OR if fb_user_id is populated, update an existing one.
	app.post('/profiles', function (req, res) {
		
		var data = req.body;
		console.log('Adding profile: ', data);

		var createNewUser = function() {
			app.db.collection('profiles', function(err, collection) {
				collection.insert(data, {safe:true}, function(err, result) {
					if (err) {
						res.send({'error':'Error creating new profile'});
					} else {
						console.log('Success: ' + JSON.stringify(result[0]));
						res.send(result[0]);
					}
				});
			});
		};

		getUserFromFacebookUserId(data.profile.fb_user_id, function(err, results) {
			if(!results) {
				createNewUser();
			} else {
				res.send({result: "USER_ALREADY_EXISTS"});
			}
		});
	});

	// Update profile with flight data from supplied flight number.
	app.post('/profiles/:id/flight', function (req, res) {
		var id = req.params.id;
		var post = req.body;
		console.log("Updating profile "+id+" with data "+JSON.stringify(post));

		var updateProfileWithFlightData = function(data) {
			app.db.collection('profiles', function(err, collection) {
				collection.update({_id: ObjectID(id)},
						{$set: {flight: data.flight, airport: data.airport}},
						{w: 1},
					function(err) {
						if(err) {
							console.log(err);
							res.send({result: "DATABASE_UPDATE_FAILED"})
						} else {
							res.send({result: "OK"});
						}
					});
			});
		};

		schiphol.getFlight(post.flightNumber, function(err, result) {
			if(err) {
				res.send({result: err});
			} else {
				if(!result.Flights.Flight) {
					console.log("Flight not found: "+post.flightNumber);
					res.send({result: "FLIGHT_NOT_FOUND"});
				} else {
					var flightData = {
						number: result.Flights.Flight.FlightNumber,
						date: result.Flights.Flight.ScheduleDate,
						time: result.Flights.Flight.ScheduleTime,
						gate: result.Flights.Flight.Gate
					};
					// yeah yeah, should be nicer, use promises
					var route = result.Flights.Flight.Routes.Route;
					schiphol.getAirport(route["@iata"], function(err, result) {
						if(err) {
							res.send({result: err});
						} else {
							var airport = {
								name: result.Airport.Name,
								city: result.Airport.City,
								country: result.Airport.Country
							};
							updateProfileWithFlightData({flight: flightData, airport: airport});
						}
					});
				}
			}
		});
	});
};

module.exports = setRoutes;
