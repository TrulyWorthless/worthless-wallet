const WorthlessWallet = artifacts.require("WorthlessWallet")
const Token = artifacts.require("Token")
var Abi = require('ethereumjs-abi')
const Web3 = require('web3')

contract("WorthlessWallet", accounts => {
  const coinbase = accounts[0]
  var wallet
  var token

  beforeEach(async () => {
    wallet = await WorthlessWallet.new({from: coinbase})
    token = await Token.new({from: coinbase})
  });

  describe("Overall wallet", () => {
    it("arbitrary execute view only", async () => {
      var sig = Abi.methodID("balanceOf", ['address']).toString('hex')
      let payload = '0x' + sig + '000000000000000000000000aea885cb62cb920f6fa15a39aa95b2d872e2b87e'
      assert.equal(await wallet.staticExecute.call(token.address, payload), "0x000000000000000000000000000000000000000000000000000000174876e800", "Did not provide correct output")

      sig = Abi.methodID("totalSupply", ['']).toString('hex')
      payload = '0x' + sig
      assert.equal(await wallet.staticExecute.call(token.address, payload), "0x000000000000000000000000000000000000000000000000000000174876e800", "Did not provide correct output")
    });

    it("arbitrary execute", async () => {
      var sig = Abi.methodID("transfer", ['address', 'uint256']).toString('hex')
      let payload = '0x' + sig + '0000000000000000000000009D0bcC79E8D9FEBb194ee519beEFF5221b495A210000000000000000000000000000000000000000000000000000000000000064'
      await token.transfer(wallet.address, 100)

      sig = Abi.methodID("balanceOf", ['address']).toString('hex')
      payload = '0x' + sig + '0000000000000000000000009D0bcC79E8D9FEBb194ee519beEFF5221b495A21'
      // assert.equal(await wallet.staticExecute.call(token.address, payload), "0x0000000000000000000000000000000000000000000000000000000000000064", "Did not provide correct output")
    });
  });
});
