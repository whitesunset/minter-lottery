const app = require("./app");
const config = require("./config");
const db = require("./db");

const server = app.listen(config.port, function() {
  console.log("Express (API SERVER) is listening on port " + config.port);
});
