const { MongoClient, ObjectID } = require("mongodb").MongoClient;

MongoClient.connect("mongodb://localhost:27017/TodoDB", (error, db) => {
	if (error) {
		return console.log("Unable to connect to database server.");
	}

	console.log("Connected to MongoDB server.");

	/*db.collection("Todos").insertOne({
		text: "Something to do",
		completed: false
	}, (error ,result) => {
		if (error) {
			return console.log("Unable to insert todo.", error);
		}

		console.log(JSON.stringify(result.ops, undefined, 2));
	});*/

	db.collection("Users").insertOne({
		name: "Shawn",
		age: 24,
		location: "Malta"
	}, (error, result) => {
		if (error) {
			return console.log("Unable to insert user.", error);
		}

		console.log(JSON.stringify(result.ops, undefined, 2));
	});

	db.close();
});