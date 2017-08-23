const env = process.env.NODE_ENV || "dev";

if (env === "dev") {
	const config = require("./config/config.json");
	process.env.PORT = config.dev.PORT;
	process.env.MONGODB_URI = config.dev.MONGODB_URI;
	process.env.JWT_SECRET = config.dev.JWT_SECRET;
}
else {
	process.env.MONGODB_URI = "mongodb://shawn92:admin@ds147799.mlab.com:47799/todos-db";
}

console.log(process.env.PORT);
console.log(process.env.MONGODB_URI);

const _ = require("lodash");
const express = require("express");
const parser = require("body-parser");
const bcrypt = require("bcryptjs");

const auth = require("./security/jwt");
const mongoose = require("./db/mongoose");
const { ObjectID } = require("mongodb");

const Todo = require("./model/todo");
const User = require("./model/user");

const server = express();
const router = express.Router();

server.use(router);

router.use(parser.json());

const login = (email, password) => {
	return User.findOne({email}).then(user => {
		if (!user) {
			return Promise.reject("User does not exist.");
		}

		return new Promise((resolve, reject) => {
			bcrypt.compare(password, user.password, (err, res) => {
				if (res) {
					resolve(user);
				}
				else {
					reject("Incorrect password.");
				}
			});
		});
	});
};

const logout = (user, token) => {
	return User.findByIdAndUpdate(user._id, {
		$pull: {
			tokens: {
				token: token
			}
		}
	});
};

const authenticate = (req, res, next) => {
	const token = req.header("x-auth");

	return auth.verifyAuthToken(token).then(authToken => {
		console.log(token);
		User.findOne({
			"_id": authToken.decoded,
			"tokens.access": authToken.access
		}).then(user => {
			if (!user) {
				return res.status(401).send();
			}
			req.user = _.pick(user, ["_id", "email"]);
			req.token = token;
			next();
		});
	}, (e) => res.status(401).send()); // else send unauthorized
};

const hashPassword = (password) => {
	const salt = bcrypt.genSaltSync(10);
	return bcrypt.hashSync(password, salt);
}

// POST /todos
router.post("/todos", authenticate, (req, res) => {
	const todo = new Todo({
		text: req.body.text,
		completed: req.body.completed,
		_creator: req.user._id
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
router.get("/todos", authenticate, (req, res) => {
	Todo.find({
		_creator: req.user._id
	}).then((docs) => {
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
router.get("/todos/:id", authenticate, (req, res) => {
	const id = req.params.id;
	if (!ObjectID.isValid(id)) {
		return res.status(404).send({
			error: "Not found.",
			status: res.statusCode
		});
	}

	Todo.findOne({
		_id: id,
		_creator: req.user._id
	}).then((doc) => {
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
router.delete("/todos/:id", authenticate, (req, res) => {
	const id = req.params.id;
	if (!ObjectID.isValid(id)) {
		return res.status(404).send({
			error: "Not found.",
			status: res.statusCode
		});
	}

	Todo.findByOneAndRemove({
		_id: id,
		_creator: req.user._id
	}).then((doc) => {
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
router.patch("/todos/:id", authenticate, (req, res) => {
	const id = req.params.id;
	const body = _.pick(req.body, ["text", "completed"]);

	if (!ObjectID.isValid(id)) {
		return res.status(404).send({
			error: "Not found.",
			status: res.statusCode
		});
	}

	Todo.findOneAndUpdate({
		_id: id,
		_creator: req.user._id
	}, {$set: body}, {new: true}).then((doc) => {
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

	const user = new User({
		email: body.email, 
		password: hashPassword(body.password)
	});

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

// GET /users/me
router.get("/users/me", authenticate, (req, res) => {
	res.send(req.user);
});

// POST /users/login
router.post("/users/login", (req, res) => {
	const body = _.pick(req.body, ["email", "password"]);
	login(body.email, body.password).then((user) => {
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

// DELETE /users/logout
router.delete("/users/logout", authenticate, (req, res) => {
	const user = req.user;
	const token = req.token;

	logout(user, token).then(() => {
		res.status(200).send();
	}, (e) => {
		res.status(400).send();
	});
})

server.listen(process.env.PORT || 3000, () => {
	console.log("Connected to server.");
});