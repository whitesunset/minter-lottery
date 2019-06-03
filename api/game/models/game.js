const mongoose = require("mongoose");

const GameSchema = new mongoose.Schema({
  status: String,
  gameNumber: Number,
  startBlock: Number,
  endBlock: Number,
  seed: String,
  privateKey: String,
  address: String,
  ticketPrice: Number,
  coin: String,
  chainId: Number,
  transactions: Array,
  ticketsNumber: Number,
  tickets: Array,
  returned: Array,
  winners: Array,
  winTx: String
});

module.exports = mongoose.model("Game", GameSchema);
