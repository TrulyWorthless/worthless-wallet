const ERC20Wallet = artifacts.require("ERC20Wallet");

module.exports = function (deployer) {
  deployer.deploy(ERC20Wallet);
};
