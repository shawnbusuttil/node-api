const { PBKDF2 } = require("crypto-js");

const password = "1234hthrth56";
const salt = "saly5yr5yrtht";

const hash = new PBKDF2(password, salt, { keySize: 512/32, iterations: 1000 });

console.log(hash.toString());



/*const jwt = require("jsonwebtoken");

const data = { 
	id: 10
};

const token = jwt.sign(data, "salt");
console.log(token);

const decoded = jwt.verify(token, "salt");
console.log("decoded", decoded);*/

// sign - takes id and returns an object with hash included
// verify - takes the hash and verifies it