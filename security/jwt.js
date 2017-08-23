const jwt = require("jsonwebtoken");

function generateAuthToken(user) {
	const access = "auth";
	const token = jwt.sign({ id: user.id, access }, process.env.JWT_SECRET).toString();

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
		decoded = jwt.verify(token, process.env.JWT_SECRET);
		console.log(decoded.id);
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