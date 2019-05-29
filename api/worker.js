const utils = require("./controllers/utils");
const config = require("./config");
const fs = require("fs");

const nanoid = require("nanoid");
const TelegramBot = require("node-telegram-bot-api");
const MinterWallet = require("minterjs-wallet");
const MinterSDK = require("minter-js-sdk");

const adminBot = new TelegramBot(config.adminBotToken, { polling: true });

const minter = new MinterSDK.Minter({
  apiType: "node",
  baseURL: config.nodeURL
});

exports.latestBlockHeight = 0;

exports.currentGame = {};

exports.newGame = function(start, fromFile) {
  if (fromFile === undefined) {
    let wallet = MinterWallet.generateWallet();
    let privateKey = wallet.getPrivateKeyString();
    let seed = wallet.getMnemonic();
    let address = wallet.getAddressString();

    this.currentGame = {
      start: start,
      end: start + config.gameLength,
      ticketPrice: config.ticketPrice,
      ticketTicker: config.coin,
      seed: seed,
      privateKey: privateKey,
      address: address,
      transactions: [],
      tickets: [],
      returned: [],
      winners: []
    };
  } else {
    this.currentGame = fromFile;
  }

  adminBot.sendMessage(
    config.adminBotChatId,
    JSON.stringify(this.currentGame, null, 2)
  );
};

exports.stopGame = function() {
  //Select winner, pay and run new game
  if (this.currentGame.winners.length > 1 && config.stopAfterGame === true)
    return;

  const randomInteger = function(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
  };

  if (this.currentGame.tickets.length < 4) {
    let result = randomInteger(0, this.currentGame.tickets.length - 1);
    let winnerTicket = this.currentGame.tickets[result];
    let prize = Math.round(
      this.currentGame.tickets.length * config.ticketPrice * 0.97
    );
    console.log("Winner: ", winnerTicket);
    console.log("Prize: " + prize + ` ${config.coin}`);

    if (winnerTicket) {
      this.currentGame.winners.push({
        ticket: winnerTicket,
        address: winnerTicket.owner,
        prize: prize
      });
      this.saveGameToJson();
      const txParams = new MinterSDK.SendTxParams({
        privateKey: this.currentGame.privateKey,
        chainId: config.chainId,
        address: winnerTicket.owner,
        amount: prize,
        coinSymbol: config.coin,
        feeCoinSymbol: config.coin,
        gasPrice: 1,
        message: `You won the Lottery!`
      });

      minter
        .postTx(txParams)
        .then(txHash => {
          console.log(`Prize Tx: ${txHash}`);
          this.currentGame.returned.push(transaction.hash);

          adminBot.sendMessage(
            config.adminBotChatId,
            JSON.stringify(this.currentGame, null, 2)
          );
        })
        .catch(error => {
          const errorMessage = error.response.data.error.log;
          console.log("Prize error" + errorMessage);
        });
    }

    if (config.stopAfterGame === false) this.newGame(this.latestBlockHeight);
    this.saveGameToJson();
  } else {
    let winners = [];

    let prize1 = Math.round(
      this.currentGame.tickets.length * config.ticketPrice * 0.4
    );
    let prize2 = Math.round(
      this.currentGame.tickets.length * config.ticketPrice * 0.33
    );
    let prize3 = Math.round(
      this.currentGame.tickets.length * config.ticketPrice * 0.24
    );

    for (let i = 0; i < 3; i++) {
      let result = randomInteger(0, this.currentGame.tickets.length - 1);
      let ticket = this.currentGame.tickets[result];
      let prize;
      switch (i) {
        case 0:
          prize = prize1;
          break;
        case 1:
          prize = prize2;
          break;
        case 2:
          prize = prize3;
          break;
      }
      winners.push({
        ticket: ticket,
        address: ticket.owner,
        prize: prize
      });
    }

    console.log("Winners: ", winners);
    console.log("Prize: ", prize1, prize2, prize3);

    for (let i = 0; i < 3; i++) this.currentGame.winners = [...winners];
    this.saveGameToJson();

    const txParams = new MinterSDK.MultisendTxParams({
      privateKey: this.currentGame.privateKey,
      chainId: config.chainId,
      feeCoinSymbol: config.coin,
      gasPrice: 1,
      message: `You won the Lottery!`,
      list: this.currentGame.winners.map(item => {
        return {
          value: item.prize,
          coin: config.coin,
          to: item.address
        };
      })
    });

    minter
      .postTx(txParams)
      .then(txHash => {
        console.log(`Prize Tx: ${txHash}`);
        this.currentGame.returned.push(transaction.hash);

        adminBot.sendMessage(
          config.adminBotChatId,
          JSON.stringify(this.currentGame, null, 2)
        );
      })
      .catch(error => {
        const errorMessage = error.response.data.error.log;
        console.log("Prize error" + errorMessage);
      });
  }

  if (this.currentGame.winners.length > 1 && config.stopAfterGame === false) {
    this.newGame(this.latestBlockHeight);
  }
};

exports.newTransaction = function(transaction) {
  if (
    transaction.from !== this.currentGame.address &&
    transaction.type === 1 &&
    transaction.block > this.currentGame.start &&
    transaction.block < this.currentGame.end
  ) {
    this.currentGame.transactions.push(transaction);
  }

  if (
    transaction.from !== this.currentGame.address &&
    transaction.data.coin === this.currentGame.ticketTicker &&
    transaction.type === 1 &&
    transaction.block > this.currentGame.start &&
    transaction.block < this.currentGame.end
  ) {
    if (transaction.data.value > this.currentGame.ticketPrice) {
      // Generate tickets
      let ticketsNumber = Math.floor(
        transaction.data.value / this.currentGame.ticketPrice
      );
      for (let i = 0; i < ticketsNumber; i++) {
        let ticket = {
          id: nanoid(),
          owner: transaction.from,
          hash: transaction.hash,
          block: transaction.block
        };
        this.currentGame.tickets.push(ticket);
        console.log("New ticket from: " + ticket.owner);
      }
    }
  }
  if (
    transaction.from !== this.currentGame.address &&
    (transaction.data.coin !== this.currentGame.ticketTicker) |
      (transaction.data.value < this.currentGame.ticketPrice) &&
    transaction.type === 1 &&
    transaction.block > this.currentGame.start &&
    transaction.block < this.currentGame.end &&
    this.currentGame.returned.indexOf(transaction.hash) === -1
  ) {
    // Return transaction
    const txParams = new MinterSDK.SendTxParams({
      privateKey: this.currentGame.privateKey,
      chainId: config.chainId,
      address: transaction.from,
      amount: transaction.data.value - 1,
      coinSymbol: transaction.data.coin,
      feeCoinSymbol: transaction.data.coin,
      gasPrice: 1,
      message: `Reject. We accept only LOTTERY coin. Minimap ticket price is ${
        this.currentGame.ticketPrice
      } ${this.currentGame.ticketTicker}`
    });

    minter
      .postTx(txParams)
      .then(txHash => {
        console.log(`Rejected: ${txHash}`);
        this.currentGame.returned.push(transaction.hash);
      })
      .catch(error => {
        const errorMessage = error.response.data.error.log;
        console.log("Reject error" + errorMessage);
      });
  }
};

exports.run = function() {
  // Get latest block
  let getBlockHeight = utils.getBlocksHeight();
  getBlockHeight.then((result, err) => {
    this.latestBlockHeight = result.body.data.latestBlockHeight;

    let rawdata = fs.readFileSync("game.json");
    if (fs.existsSync("game.json")) {
      let game = JSON.parse(rawdata);
      if (
        game.start < this.latestBlockHeight &&
        game.end > this.latestBlockHeight
      ) {
        this.currentGame = game;
      } else {
        this.newGame(this.latestBlockHeight);
        console.log(this.currentGame);
      }
    } else {
      this.newGame(this.latestBlockHeight);
      console.log(this.currentGame);
    }
  });

  setInterval(() => {
    let getBlockHeight = utils.getBlocksHeight();
    getBlockHeight.then((result, err) => {
      this.latestBlockHeight = result.body.data.latestBlockHeight;
    });
    console.log("Block Height: " + this.latestBlockHeight);
  }, 5200);

  // Update transactions =>
  setInterval(() => {
    let getTransactions = utils.getTransactions(this.currentGame.address);
    getTransactions.then((result, err) => {
      let arr = result.body.data;

      for (let i = 0; i < arr.length; i++) {
        let toAdd = true;
        for (let j = 0; j < this.currentGame.transactions.length; j++) {
          if (arr[i].hash === this.currentGame.transactions[j].hash) {
            toAdd = false;
          }
        }
        if (toAdd === true) {
          this.newTransaction(arr[i]);
        }
      }
    });
  }, 5000);

  setInterval(() => {
    //Check the end of game and sync with json
    this.saveGameToJson();
    if (this.latestBlockHeight > this.currentGame.end) {
      this.stopGame();
    }
  }, 6000);
};

exports.saveGameToJson = function() {
  let data = JSON.stringify(this.currentGame, null, 2);
  fs.writeFileSync("game.json", data, err => {
    if (!err) console.log("json saved");
  });
};
