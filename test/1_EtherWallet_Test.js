const EtherWallet = artifacts.require("EtherWallet")
const Web3 = require('web3')

contract("EtherWallet", accounts => {
  const coinbase = accounts[0]
  var wallet;

  beforeEach(async () => {
    wallet = await EtherWallet.new({from: coinbase})
  });

  describe("Ownable functions are operating correctly", () => {
    it("The contract creator is the owner", async () => {
      assert(await wallet.isOwner(coinbase), "The address to deploy contract should be owner")
      assert(!await wallet.isOwner(accounts[1]), "There should not be other owners initially")
    });

    it("Owners can be added", async () => {
      assert(!await wallet.isOwner(accounts[1]), "Address has not yet been made an owner")
      await wallet.addOwner(accounts[1], {from: coinbase})
      assert(await wallet.isOwner(accounts[1]), "Address should have been made owner")
    });

    it("Owners can be removed", async () => {
      await wallet.addOwner(accounts[1], {from: coinbase})
      assert(await wallet.isOwner(accounts[1]), "Address was not added successfully")
      await wallet.removeOwner(accounts[1], {from: accounts[1]})
      assert(!await wallet.isOwner(accounts[1]), "Address should have been removed")
    });

    it("OnlyOwners can add or remove owner", async () => {
      try {
        await wallet.addOwner(accounts[1], {from: accounts[1]})
        throw new Error("Error was not thrown");
      } catch (error) {
        assert.equal(error.reason, "Ownable: caller is not an owner", "Non-owners cannot add owners");
      }
      await wallet.addOwner(accounts[1], {from: coinbase})

      try {
        await wallet.removeOwner(accounts[1], {from: accounts[2]})
        throw new Error("Error was not thrown");
      } catch (error) {
        assert.equal(error.reason, "Ownable: caller is not an owner", "Non-owners cannot remove owners");
      }
    });

    it("Adding and removing owners must be done on valid addresses", async () => {
      await wallet.addOwner(accounts[1], {from: coinbase})
      try {
        await wallet.addOwner(accounts[1], {from: coinbase})
        throw new Error("Error was not thrown");
      } catch (error) {
        assert.equal(error.reason, "Ownable: address is already owner", "Owners cannont be added twice");
      }

      try {
        await wallet.removeOwner(accounts[2], {from: coinbase})
        throw new Error("Error was not thrown");
      } catch (error) {
        assert.equal(error.reason, "Ownable: address is not an owner", "Non-owners cannot be removed");
      }
    });

    it("There needs to always be an owner", async () => {
      try {
        await wallet.removeOwner(coinbase, {from: coinbase})
        throw new Error("Error was not thrown");
      } catch (error) {
        assert.equal(error.reason, "Ownable: no remaining owners", "Only one owner remained");
      }
    });
  });

  describe("Wallet can properly transfer ether", () => {
    it("There is no initial balance", async () => {
      assert.equal(await wallet.getBalance(), 0, "There should not be a balance")
    });

    it("Wallet recieves ether", async () => {
      assert.equal(await wallet.getBalance(), 0, "Initial: balance does not match")
      await web3.eth.sendTransaction({from:coinbase, to:wallet.address, value:1})
      assert.equal(await wallet.getBalance(), 1, "Receive: balance does not match")
    });

    it("Wallet sends ether", async () => {
      let secondary = await EtherWallet.new({from: coinbase})
      await web3.eth.sendTransaction({from:coinbase, to:wallet.address, value:100})
      assert.equal(await secondary.getBalance(), 0, "Initial: balance does not match")
      assert.equal(await wallet.getBalance(), 100, "Receive: balance does not match")
      await wallet.send(secondary.address, 50)
      assert.equal(await wallet.getBalance(), 50, "Wallet: correct amount not transfered")
      assert.equal(await secondary.getBalance(), 50, "Secondary: did not recieve correct amount")
    });

    it("Non-owners cannot send ether", async () => {
      let secondary = await EtherWallet.new({from: coinbase})
      assert.equal(await wallet.getBalance(), 0, "Initial: balance does not match")
      await web3.eth.sendTransaction({from:coinbase, to:wallet.address, value:1})
      assert.equal(await wallet.getBalance(), 1, "Receive: balance does not match")
      try {
        await wallet.send(secondary.address, 1, {from: accounts[1]})
        throw new Error("Error was not thrown");
      } catch (error) {
        assert.equal(error.reason, "Ownable: caller is not an owner", "Non-owners cannot send ether");
      }
    });
  });
});
