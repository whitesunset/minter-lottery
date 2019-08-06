const game = require("./models/game");
const utils = require("../controllers/utils");
const { generateWallet } = require("minterjs-wallet");
const config = require("../config");

const fs = require('fs');

const init = async function () {
  let currentBlock = await utils.getBlocksHeight();
  let resultGame;

  resultGame = await game.findOne({ status: "active" });

  if (resultGame === null) {
    resultGame = await createNewGame(currentBlock);
  }

  if (resultGame.endBlock < currentBlock) {
    await game.findByIdAndUpdate(resultGame._id, { status: "completed" });
    resultGame = await createNewGame(currentBlock);
  }

  console.log("Game id: ", resultGame._id, "\nAddress: ", resultGame.address);

  return resultGame._id;
};

const createNewGame = async function (currentBlock) {
  const wallet = generateWallet();

  let gameSettings;

  try {
    if (fs.existsSync('game.json')) {
      let content = fs.readFileSync('game.json');
      gameSettings = JSON.parse(content);
      console.log(gameSettings);

    }
  } catch (err) {
    fs.writeFileSync('game.json', JSON.stringify({ gameNumber: 0 }));
    gameSettings = { gameNumber: 0 };
  }

  console.log('***');

  const newGame = await game.create({
    status: "active",
    gameNumber: gameSettings.gameNumber + 1,
    startBlock: currentBlock,
    endBlock: currentBlock + config.gameLength,
    seed: wallet.getMnemonic(),
    privateKey: wallet.getPrivateKeyString(),
    address: wallet.getAddressString(),
    ticketPrice: config.ticketPrice,
    coin: config.coin,
    chainId: config.chainId,
    ticketsNumber: 0,
    transactions: [],
    tickets: [],
    returned: [],
    winners: [],
    winTx: ""
  });

  fs.writeFileSync('game.json', JSON.stringify({ currentGameId: newGame._id, gameNumber: newGame.gameNumber }))

  const { Bot } = require('./main');

  let message = `<strong>Началась игра #${newGame.gameNumber}!</strong>\n\nЦена 1 билета: <strong>${newGame.ticketPrice} ${newGame.coin}</strong>\nБольше информации: http://win.minter.work\n\nАдрес для покупки билетов в сообщении ниже.`;

  Bot.sendMessage(config.botChatId, message, {
    parse_mode: "HTML",
    disable_web_page_preview: true
  }).then(() => {

    // Send game wallet
    Bot.sendMessage(config.botChatId, newGame.address, {
      parse_mode: "HTML",
      disable_web_page_preview: true
    })
  })

  return newGame;
};

module.exports = init;
