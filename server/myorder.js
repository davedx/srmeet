var HmacSHA1 = require("crypto-js/hmac-sha1");
var Base64 = require("crypto-js/enc-base64");
var request = require("request");

var api_key = "36bd8913-bf56-4aa0-9492-49a3240597ea";
var api_secret = "12H@c9kT$At";
var appBundleId = "com.myorder.PlayGround";
var baseUrl = "playground-java.myorder.nl";
var currentToken = "";

var buildOptions = function(opts) {
	return {
		url: "http://" + baseUrl + "/api/v1/" + opts.path,
		headers: {
			'Accept': 'application/json',
			"Authorization": opts.spr,
			"Accept-Language": "en-us"
		}
	};
};

var doRequest = function(options, errorCode, callback) {
	request(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			callback(undefined, JSON.parse(body));
		} else {
			console.log(error);
			callback(errorCode);
		}
	});
};

var setRoutes = function(app) {
	// Get chats for a user.
	app.get('/merchants/:lat_long', function (req, res) {

		var timestamp = Date.now();

		//var signature = BASE64(HMAC_SHA1(privatekey + timestamp + token + appBundleId, privatekey));
		var signature = HmacSHA1(api_secret + timestamp + currentToken + appBundleId, api_secret);
		var finalhash = signature.toString(Base64);
		var safehash = finalhash.replace("+", "-", "g");
		var safehash = safehash.replace("\/", "_", "g");
		var safehash = safehash.replace("=", " ", "g").trim();
		console.log(safehash);

		var spr = 'SPR k="'+api_key+'",tm="' + timestamp + '",';
		if(currentToken) {
			spr += 't="' + currentToken + '",';
		}
		spr += 'b="' + appBundleId + '",s="' + safehash + '",v="2"';

		console.log("SPR: ", spr);

		var path = "auth/login?phone=+31634796837&deviceId=0F10191CA1BAA97718";

		var options = buildOptions({
			path: path,
			spr: spr
		});
		doRequest(options, "NO_MERCHANTS", function(err, response) {
			if(!err) {
				console.log(response);
				getMerchants();
//				res.send(response);
//				res.send([]);
			} else {
				res.send({result: err});
			}
		});

		function getMerchants() {
			console.log("Getting merchants in SCHIPHOL RIJK BITCHES");
			var options = buildOptions({
				path: "catalog/merchants?location=52.310746,4.768285",
				spr: spr
			});
			doRequest(options, "BAH", function(err, response) {
				console.log(response);
			});
		}

		// var options = buildOptions("merchants");

		// doRequest(options, "NO_MERCHANTS", function(err, response) {
		// 	if(!err) {
		// 		res.send([]);
		// 	} else {
		// 		res.send({result: "ERROR"});
		// 	}
		// });
	});
};

module.exports = setRoutes;
