const express = require("express");
const parser = require("body-parser");

const mongoose = require("./../db/mongoose");
const { ObjectID } = require("mongodb");

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
		return res.send(doc);
	}, (e) => {
		return res.status(400).send({
			error: "Bad request.",
			status: res.statusCode
		});
	});
});

// GET /todos
server.get("/todos", (req, res) => {
	Todo.find().then((docs) => {
		return res.status(200).send({
			todos: docs,
			status: res.statusCode
		});
	}, (e) => {
		return res.status(400).send({
			error: "Bad request.",
			status: res.statusCode
		});
	});
});

// GET /todos/:id
server.get("/todos/:id", (req, res) => {
	const id = req.params.id;
	if (!ObjectID.isValid(id)) {
		return res.status(404).send({
			error: "Not found.",
			status: res.statusCode
		});
	}

	Todo.findById(id).then((doc) => {
		if (!doc) {
			return res.status(404).send({
				error: "Not found.",
				status: res.statusCode
			});
		}
		return res.status(200).send({
			todo: doc,
			status: res.statusCode
		});
	}, (e) => {
		res.status(400).send({
			error: "Bad request.",
			status: res.statusCode
		})
	});
});

server.listen(process.env.PORT || 3000, () => {
	console.log("Connected to server.");
});