const MongoClient = require("mongodb").MongoClient;

MongoClient.connect("mongodb://localhost:27017/TodoDB", (error, db) => {
	if (error) {
		return console.log("Unable to connect to database server.");
	}

	console.log("Connected to MongoDB server.");

	db.collection("Todos").find().count().then((count) => {
		console.log("Todos: " + count);
	}, (error) => {
		console.log("Could not load data.");
	});

	db.close();
});