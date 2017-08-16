const MongoClient = require("mongodb").MongoClient;

MongoClient.connect("mongodb://localhost:27017/TodoDB", (error, db) => {
	if (error) {
		return console.log("Unable to connect to database server.");
	}

	console.log("Connected to MongoDB server.");

	// delete one
	db.collection("Todos").deleteOne({text: "Eat lunch"}).then(result => {
		console.log(result);
	});

	// find one and delete
	db.collection("Todos").findOneAndDelete({completed: false}).then(result => {
		console.log(result);
	})

	db.close();
});