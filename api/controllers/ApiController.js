const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const gameDB = require("../game/models/game");
const gameWorker = require("../game/main");

router.use(
  bodyParser.urlencoded({
    extended: false
  })
);

router.use(bodyParser.json());

router.get("/status", async (req, res) => {
  result = await gameDB.findOne({ status: "active" });

  let testnet;
  if (result.chainId === 2) testnet = true;
  else testnet = false;

  let send = {
    currentBlock: gameWorker.latestBlockHeight,
    testnet: testnet,
    start: result.startBlock,
    end: result.endBlock,
    ticketPrice: result.ticketPrice,
    ticketTicker: result.coin,
    address: result.address,
    transactions: result.transactions.length,
    tickets: result.tickets,
    returned: result.returned.length,
    winners: result.winners
  };
  res.status(200).send(send);
});

module.exports = router;
