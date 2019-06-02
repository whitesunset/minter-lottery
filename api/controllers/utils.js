const superagent = require("superagent");
const config = require("../config");

exports.getTransactions = async function(address) {
  const responce = await superagent
    .get(config.explorerURL + "/addresses/" + address + "/transactions")
    .retry(3);

  return responce.body.data;
};

exports.getBlocksHeight = async function() {
  const responce = await superagent
    .get(config.explorerURL + "/status")
    .retry(3);
  return responce.body.data.latestBlockHeight;
};
