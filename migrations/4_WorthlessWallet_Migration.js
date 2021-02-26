const WorthlessWallet = artifacts.require("WorthlessWallet");

module.exports = function (deployer) {
  deployer.deploy(WorthlessWallet);
};
