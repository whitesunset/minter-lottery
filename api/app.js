const express = require("express");
const cors = require("cors");
const app = express();
const worker = require("./worker");

const ApiController = require("./controllers/ApiController");

app.use(cors());
app.use("/test", ApiController);

worker.run();

module.exports = app;
