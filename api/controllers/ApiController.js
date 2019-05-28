const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");

const config = require("../config");
const utils = require("./utils");
const worker = require("../worker");

router.use(
  bodyParser.urlencoded({
    extended: false
  })
);

router.use(bodyParser.json());

router.get("/height", (req, res) => {
  let send = utils.getBlocksHeight();
  send.then((result, err) => {
    res.status(200).send(result.body);
    console.log(result.body.data.latestBlockHeight);
  });
});

router.get("/wallet", (req, res) => {
  res.status(200).send(worker.currentGame.address);
});

router.get("/t", (req, res) => {
  res.status(200).send(worker.currentGame.transactions);
});

router.get("/returned", (req, res) => {
  res.status(200).send(worker.currentGame.returned);
});

router.get("/tickets", (req, res) => {
  res.status(200).send(worker.currentGame.tickets);
});

router.get("/winners", (req, res) => {
  res.status(200).send(worker.currentGame.winners);
});

router.get("/status", (req, res) => {
  let send = {
    currentBlock: worker.latestBlockHeight,
    start: worker.currentGame.start,
    end: worker.currentGame.end,
    ticketPrice: config.ticketPrice,
    ticketTicker: config.coin,
    address: worker.currentGame.address,
    transactions: worker.currentGame.transactions.length,
    tickets: worker.currentGame.tickets.length,
    returned: worker.currentGame.returned.length,
    winners: worker.currentGame.winners
  };
  res.status(200).send(send);
});

module.exports = router;
