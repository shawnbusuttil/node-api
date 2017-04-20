const { MongoClient, ObjectID } = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/TodoDB", (error, db) => {
	if (error) {
		return console.log("Unable to connect to database server.");
	}

	console.log("Connected to MongoDB server.");

	db.collection("Todos").findOneAndUpdate({
		_id: new ObjectID("58f87d0b51c0d262ab21b6a0")
	}, {
		$set: {
			completed: true
		}
	}, {
		returnOriginal: false
	}).then((result) => {
		console.log(result);
	});

	db.collection("Users").findOneAndUpdate({
		_id: new ObjectID("58f877943eb60527d0ed8b39")
	}, {
		$inc: {
			age: -1
		}
	}, {
		returnOriginal: false
	}).then((result) => {
		console.log(result);
	});

	db.close();
});