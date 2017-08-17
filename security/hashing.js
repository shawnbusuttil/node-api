const jwt = require("jsonwebtoken");

const data = { 
	id: 10
};

const token = jwt.sign(data, "salt");
console.log(token);

const decoded = jwt.verify(token, "salt");
console.log("decoded", decoded);

// sign - takes id and returns an object with hash included
// verify - takes the hash and verifies it