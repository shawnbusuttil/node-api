const mongoose = require("mongoose");

//const productionUrl = "mongodb://shawn92:admin@ds147799.mlab.com:47799/todos-db";
//const devUrl = "mongodb://localhost:27017/TodoDB";

mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI);

mongoose.exports = {
	mongoose: mongoose
};