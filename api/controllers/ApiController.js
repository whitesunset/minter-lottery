const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const gameDB = require("../game/models/game");
const gameWorker = require("../game/main");
const fs = require('fs');

router.use(
  bodyParser.urlencoded({
    extended: false
  })
);

router.use(bodyParser.json());

router.get("/status", async (req, res) => {
  // ! JSON
  let settings = JSON.parse(fs.readFileSync('game.json'))
  let result = await gameDB.findById(settings.currentGameId);

  let testnet;
  if (result.chainId === 2) testnet = true;
  else testnet = false;

  let send = {
    currentBlock: gameWorker.latestBlockHeight,
    testnet: testnet,
    gameNumber: result.gameNumber,
    start: result.startBlock,
    end: result.endBlock,
    ticketPrice: result.ticketPrice,
    ticketTicker: result.coin,
    ticketsNumber: result.ticketsNumber,
    address: result.address,
    transactions: result.transactions.length,
    tickets: result.tickets,
    returned: result.returned.length,
    winners: result.winners
  };
  res.status(200).send(send);
});

router.get("/history", async (req, res) => {
  let result = await gameDB
    .find({
      status: "completed",
      ticketsNumber: { $gt: 1 }
    })
    .limit(30)
    .sort("-gameNumber");

  res.status(200).send(
    result.map(item => {
      return {
        number: item.gameNumber,
        tickets: item.ticketsNumber,
        address: item.address,
        winTx: item.winTx
      };
    })
  );
});

module.exports = router;
