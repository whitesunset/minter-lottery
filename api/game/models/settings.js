const mongoose = require("mongoose");

const SettingsSchema = new mongoose.Schema({
  name: String,
  currentGameId: String,
  gameNumber: Number
});

module.exports = mongoose.model("Settings", SettingsSchema);
