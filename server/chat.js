var ObjectID = require('mongodb').ObjectID;

var setRoutes = function(app) {
	// Get chats for a user.
	app.get('/chats/:user1/:user2', function (req, res) {
		//console.log("Responding to /chats");
		var userId1 = ObjectID(req.params.user1);
		var userId2 = ObjectID(req.params.user2);

		var collection = app.db.collection('chats');
		collection.find(
			{$or: [
				{$and: [{recipient: userId1}, {sender: userId2}]},
				{$and: [{recipient: userId2}, {sender: userId1}]}
			]}).sort({"_id": 1}).toArray(function(err, results) {
			res.send(results);
		});
	});

	// Send chat to user.
	app.post('/chats/:id/new', function (req, res) {
		var userId = ObjectID(req.params.id);
		var data = req.body;
		var senderUserId = ObjectID(data.sender);
		var message = data.message;
		var senderName = data.senderName;
		var senderFbId = data.senderFbId;
		var timestamp = new Date().toISOString();

		console.log("Adding chat: ", data);

		var addChat = function() {
			app.db.collection('chats', function(err, collection) {
				collection.insert({
					recipient: userId,
					sender: senderUserId,
					senderName: senderName,
					senderFbId: senderFbId,
					message: message,
					timestamp: timestamp
				}, {safe:true}, function(err, result) {
					if (err) {
						res.send({'error':'Error creating new chat message'});
					} else {
						console.log('Success: ' + JSON.stringify(result[0]));
						res.send(result[0]);
					}
				});
			});			
		};

		//TODO: check if user allows any chats, or only from mutual matches.
		//TODO: if only from mutual matches, check if user is mutually matched.
		addChat();
	});
};

module.exports = setRoutes;
