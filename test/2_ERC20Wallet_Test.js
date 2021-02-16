const ERC20Wallet = artifacts.require("ERC20Wallet")
const Token = artifacts.require("Token")
const Web3 = require('web3')

contract("ERC20Wallet", accounts => {
  const coinbase = accounts[0]
  var wallet;
  var token;

  beforeEach(async () => {
    wallet = await ERC20Wallet.new({from: coinbase})
    token = await Token.new({from: coinbase})
  });

  describe("Check for wallet's view functions", () => {
    it("Get token fields", async () => {
      let tokenFields = await wallet.getToken.call(token.address)
      assert.equal(tokenFields[0], 'TrulyWorthless', "Token name does not match")
      assert.equal(tokenFields[1], 'TWC', "There should be no initial balance")
      assert.equal(tokenFields[2], 2, "There should be no initial balance")
      assert.equal(tokenFields[3], '100000000000', "There should be no initial balance")
      assert.equal(tokenFields[4], 0, "There should be no initial balance")
    });

    it("Correct balance", async () => {
      assert.equal(await wallet.getBalanceOf.call(token.address), 0, "There should be no initial balance")
      await token.transfer(wallet.address, 100, {from: coinbase})
      assert.equal(await wallet.getBalanceOf.call(token.address), 100, "There should be a balance")
    });
  });

  describe("Correct allowances and view allowances", () => {
    it("Create and approve allowances", async () => {
      await token.transfer(wallet.address, 100, {from: coinbase})
      assert.equal(await wallet.getAllowanceApproved.call(token.address, accounts[1]), 0, "The should be no allowance")
      await wallet.tokenApproval(token.address, accounts[1], 50, {from: coinbase})
      assert.equal(await wallet.getAllowanceApproved.call(token.address, accounts[1]), 50, "The allowances do not match")
    });

    it("Check allowances received", async () => {
      await token.approve(wallet.address, 100, {from: coinbase})
      assert.equal(await wallet.getAllowance.call(token.address, coinbase), 100, "The wallet did not receive an allowance")
    });
  });

  describe("Verify transfers", () => {
    it("Send tokens to other addresses", async () => {
      await token.transfer(wallet.address, 500, {from: coinbase})
      await wallet.tokenTransfer(token.address, accounts[1], 100, {from: coinbase})
      assert.equal(await token.balanceOf.call(accounts[1]), 100, "Did not recieve the correct amount")
      assert.equal(await token.balanceOf.call(wallet.address), 400, "The remaining amount is not accurate")
    });

    it("Send tokens on behalf of other addresses", async () => {
      await token.approve(wallet.address, 100, {from: coinbase})
      assert.equal(await token.balanceOf.call(accounts[1]), 0, "Should not have inital balance")
      await wallet.tokenTransferFrom(token.address, coinbase, accounts[1], 100, {from: coinbase})
      assert.equal(await token.balanceOf.call(accounts[1]), 100, "Should not have inital balance")
    });
  });
});
