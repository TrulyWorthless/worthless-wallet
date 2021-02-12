pragma solidity ^0.6.0;

import "./ERC20Wallet.sol";

contract WorthlessWallet is ERC20Wallet {
  string walletName;
  constructor (string memory name) public {
    walletName = name;
  }

  function getName() public view returns (string memory) {
    return walletName;
  }

  function setName(string memory name) public onlyOwner {
    walletName = name;
  }
}
