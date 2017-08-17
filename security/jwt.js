const jwt = require("jsonwebtoken");

const salt = "salt";

function generateAuthToken(user) {
	const access = "auth";
	const token = jwt.sign({ id: user.id, access }, salt).toString();

	const authToken = {
		access: access,
		token: token
	};

	return new Promise((resolve, reject) => {
		resolve(authToken);
	});
}

module.exports = {
	generateAuthToken
}