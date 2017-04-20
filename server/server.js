const express = require("express");
const parser = require("body-parser");

const mongoose = require("./../db/mongoose");
const Todo = require("./../model/todo");
const User = require("./../model/user");

const server = express();

server.use(parser.json());

// POST /todos
server.post("/todos", (req, res) => {
	const todo = new Todo({
		text: req.body.text
	});

	todo.save().then((doc) => {
		res.send(doc);
	}, (e) => {
		res.status(400).send({
			error: "Bad request.",
			status: res.statusCode
		});
	});
});

server.listen(3000, () => {
	console.log("Connected on port 3000.");
});
/*

const newTodo = new Todo({
	text: "cook dinner"
});

newTodo.save().then((doc) => {
	console.log("Saved new todo.", doc);
}, (e) => {
	console.log("Unable to save entry.");
});

const anotherTodo = new Todo({
	text: "go to gym",
	completed: false,
	completedAt: 123
});

anotherTodo.save().then((doc) => {
	console.log("Saved new todo.", doc);
}, (e) => {
	console.log("Unable to save entry.");
});

const User = mongoose.model("User", user);

const newUser = new User({
	email: "abc@test.com"
});

newUser.save().then((doc) => {
	console.log("Saved new user.", doc);
}, (e) => {
	console.log("Unable to save entry.", e);
});*/
