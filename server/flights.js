var schiphol = require('./schiphol');
var ObjectID = require('mongodb').ObjectID;

var setRoutes = function(app) {
	// Update profile with flight data from supplied flight number.
	app.get('/flights', function (req, res) {
		schiphol.getFlights(function(err, result) {
			if(err) {
				res.send({result: err});
			} else {
				res.send(result);
			}
		});
	});
};

module.exports = setRoutes;
