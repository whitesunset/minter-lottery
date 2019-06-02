const utils = require("../controllers/utils");
const game = require("./models/game");

const init = require("./init");
const transactionsWorker = require("./transactionsWorker");
const win = require("./win");

exports.latestBlockHeight = 0;

exports.run = async function() {
  this.latestBlockHeight = await utils.getBlocksHeight();
  let gameId = await init();
  transactionsWorker(gameId);

  setInterval(async () => {
    transactionsWorker(gameId);

    utils.getBlocksHeight().then(res => {
      this.latestBlockHeight = res;
    });

    res = await game.findById(gameId);

    if (!res) return;
    if (res.endBlock <= this.latestBlockHeight) {
      console.log("*** Start new game!");

      await win(gameId);
      gameId = await init(gameId);
    }

    console.log(`Block: ${this.latestBlockHeight}`);
  }, 5000);
};
