const express = require("express");
const cors = require("cors");
const app = express();

const ApiController = require("./controllers/ApiController");

app.use(cors());
app.use("/api", ApiController);

const game = require("./game/main");
game.run();

module.exports = app;
