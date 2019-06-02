const mongoose = require("mongoose");
const config = require("./config");

mongoose.connect(config.db, { useNewUrlParser: true });

db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", function() {
  console.log("MongoDB connected!");
});

module.exports = mongoose.connection;
