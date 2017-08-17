const env = process.env.NODE_ENV || "dev";

if (env === "dev") {
	process.env.PORT = 3000;
	process.env.MONGODB_URI = "mongodb://localhost:27017/TodoDB";
}
else {
	process.env.MONGODB_URI = "mongodb://shawn92:admin@ds147799.mlab.com:47799/todos-db";
}

console.log(process.env.PORT);
console.log(process.env.MONGODB_URI);

const _ = require("lodash");
const express = require("express");
const parser = require("body-parser");

const auth = require("./security/jwt");
const mongoose = require("./db/mongoose");
const { ObjectID } = require("mongodb");

const Todo = require("./model/todo");
const User = require("./model/user");

const server = express();
const router = express.Router();

server.use(router);

router.use(parser.json());

// POST /todos
router.post("/todos", (req, res) => {
	const todo = new Todo({
		text: req.body.text,
		completed: req.body.text
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
router.get("/todos", (req, res) => {
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
router.get("/todos/:id", (req, res) => {
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
		});
	});
});

// DELETE /todos/:id
router.delete("/todos/:id", (req, res) => {
	const id = req.params.id;
	if (!ObjectID.isValid(id)) {
		return res.status(404).send({
			error: "Not found.",
			status: res.statusCode
		});
	}

	Todo.findByIdAndRemove(id).then((doc) => {
		if (!doc) {
			return res.status(404).send({
				error: "Not found.",
				status: res.statusCode
			});
		}
		return res.status(200).send({
			todo: doc,
			status: res.status
		});
	}, (e) => {
		res.status(400).send({
			error: "Bad request.",
			status: res.statusCode
		});
	})
});

// PATCH /todos/:id
router.patch("/todos/:id", (req, res) => {
	const id = req.params.id;
	const body = _.pick(req.body, ["text", "completed"]);

	if (!ObjectID.isValid(id)) {
		return res.status(404).send({
			error: "Not found.",
			status: res.statusCode
		});
	}

	Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((doc) => {
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
		});
	});
});

// POST /users
router.post("/users", (req, res) => {
	const body = _.pick(req.body, ["email", "password"]);
	const user = new User(body);

	user.save().then(user => {
		return auth.generateAuthToken(user).then(authToken => {
			user.tokens.push(authToken);
			user.save().then(() => {
				const data = _.pick(user, ["_id", "email"]);
				res.header("x-auth", authToken.token).send(data);
			});
		});
	}, (e) => {
		return res.status(400).send({
			error: e,
			status: res.statusCode
		});
	});
});

server.listen(process.env.PORT || 3000, () => {
	console.log("Connected to server.");
});