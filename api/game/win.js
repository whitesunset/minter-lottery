const game = require("./models/game");
const utils = require("../controllers/utils");
const config = require("../config");

const MinterSDK = require("minter-js-sdk");
const minter = new MinterSDK.Minter({
  apiType: "node",
  baseURL: config.nodeURL
});

let totalBank = 0;

const win = async function (gameId) {
  let currentGame = await game.findById(gameId);

  const randomInteger = function (min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
  };

  if (currentGame.tickets.length === 0) {
    currentGame.status = "completed";
    await game.findByIdAndUpdate(gameId, currentGame);
    return;
  }

  if (currentGame.winners.length === 0) {
    let tickets = [];

    // Tickets array for random winners
    for (let i = 0; i < currentGame.tickets.length; i++) {
      for (let j = 0; j < currentGame.tickets[i].tickets; j++) {
        tickets.push(currentGame.tickets[i].address);
      }
    }

    let bank = tickets.length * currentGame.ticketPrice;
    totalBank = bank;

    // 1st, 2nd, 3rd places
    for (let i = 0; i < 3; i++) {
      let index = 0;
      let prize = 0;
      if (i === 0) {
        // 1st
        index = randomInteger(0, tickets.length - 1);
        prize = bank * 0.3;
        currentGame.winners.push({
          address: tickets[index],
          prize: prize
        });
      }
      if (i === 1) {
        // 2nd
        index = randomInteger(0, tickets.length - 1);
        prize = bank * 0.25;
        currentGame.winners.push({
          address: tickets[index],
          prize: prize
        });
      }
      if (i === 2) {
        // 3rd
        index = randomInteger(0, tickets.length - 1);
        prize = bank * 0.2;
        currentGame.winners.push({
          address: tickets[index],
          prize: prize
        });
      }
    }

    // 4 - 10 winners
    for (let i = 0; i < 7; i++) {
      // 4 - 10
      let prize = 0;
      let index = randomInteger(0, tickets.length - 1);
      prize = bank * 0.01;
      currentGame.winners.push({
        address: tickets[index],
        prize: prize
      });
    }

    // 10 - 20 winners
    for (let i = 0; i < 10; i++) {
      // 4 - 10
      let prize = 0;
      let index = randomInteger(0, tickets.length - 1);
      prize = bank * 0.008;
      currentGame.winners.push({
        address: tickets[index],
        prize: prize
      });
    }

    // Save to db
    await game.findByIdAndUpdate(gameId, currentGame);
  }

  // Pay
  const txParams = new MinterSDK.MultisendTxParams({
    privateKey: currentGame.privateKey,
    chainId: currentGame.chainId,
    feeCoinSymbol: currentGame.coin,
    gasPrice: 1,
    message: `You won the Lottery! Game #${currentGame.gameNumber}`,
    list: currentGame.winners.map(item => {
      return {
        value: item.prize,
        coin: currentGame.coin,
        to: item.address
      };
    })
  });

  await minter
    .postTx(txParams)
    .then(txHash => {
      console.log(`Prize Tx: ${txHash}`);
      currentGame.winTx = txHash;
    })
    .catch(error => {
      const errorMessage = error.response.data.error;
      console.log("Error: ", errorMessage);
      currentGame.winTx = errorMessage.message;
    });

  currentGame.status = "completed";

  await game.findByIdAndUpdate(gameId, currentGame);

  const { Bot } = require('./main');
  let message = `<strong>Игра #${currentGame.gameNumber} окончена!</strong>\n\nБанк: <strong>${totalBank} ${currentGame.coin}</strong>\nВыплата: https://minterscan.net/tx/${currentGame.winTx}`;

  Bot.sendMessage(config.botChatId, message, {
    parse_mode: "HTML",
    disable_web_page_preview: true
  }).then(() => {

    // Send game wallet
    Bot.sendMessage(config.botChatId, currentGame.address, {
      parse_mode: "HTML",
      disable_web_page_preview: true
    })
  })

  return;
};

module.exports = win;
