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

function verifyAuthToken(token) {
	let decoded;

	try {
		decoded = jwt.verify(token, salt);
		return Promise.resolve({
			decoded: decoded.id,
			access: "auth"
		});
	}
	catch (e) {
		return Promise.reject();
	}
}

module.exports = {
	generateAuthToken,
	verifyAuthToken
}