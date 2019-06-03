const game = require("./models/game");
const settings = require("./models/settings");
const utils = require("../controllers/utils");
const { generateWallet } = require("minterjs-wallet");
const config = require("../config");

const TelegramBot = require("node-telegram-bot-api");
const adminBot = new TelegramBot(config.adminBotToken, { polling: false });

const init = async function() {
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

const createNewGame = async function(currentBlock) {
  const wallet = generateWallet();
  let gameSettings = await settings.findOne({ name: "settings" });
  if (gameSettings === null) {
    await settings.create({ name: "settings", gameNumber: 1 });
  }
  gameSettings = await settings.findOne({ name: "settings" });

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

  await settings.findOneAndUpdate(
    { name: "settings" },
    { currentGameId: newGame._id, gameNumber: newGame.gameNumber }
  );

  adminBot.sendMessage(config.adminBotChatId, JSON.stringify(newGame, null, 2));
  return newGame;
};

module.exports = init;
