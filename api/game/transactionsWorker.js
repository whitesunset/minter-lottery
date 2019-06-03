const game = require("./models/game");
const utils = require("../controllers/utils");
const config = require("../config");

const transactionsWorker = async function(_gameId) {
  let currentGame = await game.findById(_gameId);
  let transactions = await utils.getTransactions(currentGame.address);

  transactions.forEach(transaction => {
    let toPush = true;

    if (transaction.from === currentGame.address) {
      toPush = false;
    } else {
      for (let i = 0; i < currentGame.transactions.length; i++) {
        if (transaction.hash === currentGame.transactions[i]) {
          toPush = false;
        }
      }
    }

    // For new transactions
    if (toPush === true) {
      currentGame.transactions.push(transaction.hash);

      // Return transactions
      if (
        transaction.data.coin !== currentGame.coin ||
        transaction.data.value < currentGame.ticketPrice
      ) {
        returnTransaction(transaction);
        currentGame.returned.push(transaction.hash);
      }

      // New tickets
      if (
        transaction.data.coin === currentGame.coin &&
        transaction.data.value >= currentGame.ticketPrice
      ) {
        let index = -1;
        for (let i = 0; i < currentGame.tickets.length; i++) {
          if (currentGame.tickets[i].address === transaction.from) {
            index = i;
            break;
          }
        }

        if (index === -1) {
          ticket = {
            address: transaction.from,
            tickets: Math.floor(
              transaction.data.value / currentGame.ticketPrice
            )
          };
          currentGame.tickets.push(ticket);
          currentGame.ticketsNumber += ticket.tickets;
        }

        if (index > -1) {
          currentGame.tickets[index].tickets += Math.floor(
            transaction.data.value / currentGame.ticketPrice
          );
          currentGame.ticketsNumber += Math.floor(
            transaction.data.value / currentGame.ticketPrice
          );
        }

        console.log(
          `New tickets: ${Math.floor(
            transaction.data.value / currentGame.ticketPrice
          )}`
        );
      }
    }
  });

  // Save to DB
  await game.findByIdAndUpdate(_gameId, currentGame);

  function returnTransaction(transaction) {
    const MinterSDK = require("minter-js-sdk");
    const minter = new MinterSDK.Minter({
      apiType: "node",
      baseURL: config.nodeURL
    });

    const txParams = new MinterSDK.SendTxParams({
      privateKey: currentGame.privateKey,
      chainId: config.chainId,
      address: transaction.from,
      amount: transaction.data.value - 1,
      coinSymbol: transaction.data.coin,
      feeCoinSymbol: transaction.data.coin,
      gasPrice: 1,
      message: `Reject. We accept only ${
        currentGame.coin
      } coin. Minimal ticket price is ${currentGame.ticketPrice} ${
        currentGame.coin
      }`
    });

    minter
      .postTx(txParams)
      .then(txHash => {
        console.log(`Rejected SUCCESS: ${txHash}`);
      })
      .catch(error => {
        const errorMessage = error.response.data.error.log;
        console.log(`Reject ERROR: ${errorMessage}`);
      });
  }
};

module.exports = transactionsWorker;
