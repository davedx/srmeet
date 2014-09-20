var request = require("request");

var baseURL = "145.35.195.100";

var buildOptions = function(path) {
	return {
		url: "http://" + baseURL + path,
		headers: {
			'Accept': 'application/json'
		}
	};
};

var doRequest = function(options, errorCode, callback) {
	request(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			callback(undefined, JSON.parse(body));
		} else {
			callback(errorCode);
		}
	});
};

var getFlights = function(callback) {
	var options = buildOptions("/rest/flights/D");

	doRequest(options, "NO_FLIGHTS", function(err, response) {
		var sane = [];
		if(!err) {
			response.Flights.Flight.forEach(function(flight) {
				sane.push(flight.FlightNumber);
			});
		}
		callback(err, sane);
	});
};

var getFlight = function(flightNumber, callback) {

	var options = buildOptions("/rest/flights/D/" + flightNumber);

	doRequest(options, "FLIGHT_NOT_FOUND_API", callback);
};

var getAirport = function(airportCode, callback) {

	var options = buildOptions("/rest/airports/" + airportCode);

	doRequest(options, "AIRPORT_NOT_FOUND_API", callback);
};

exports.getFlight = getFlight;
exports.getFlights = getFlights;
exports.getAirport = getAirport;
