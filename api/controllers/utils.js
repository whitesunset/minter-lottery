const superagent = require("superagent");
const config = require("../config");

exports.addressInfo = function(address) {
  return superagent.get(config.nodeURL + "/address?address=" + address);
};

exports.getTransactions = function(address) {
  return superagent.get(
    config.explorerURL + "/addresses/" + address + "/transactions"
  );
};

exports.getBlocksHeight = function() {
  return superagent.get(config.explorerURL + "/status");
};
