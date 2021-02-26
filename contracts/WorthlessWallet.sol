pragma solidity ^0.6.0;

import "./ERC20Wallet.sol";
import "./Token.sol";

contract WorthlessWallet is ERC20Wallet {
  constructor () public {}

  function staticExecute(address endPoint, bytes memory payload) public view returns (bytes memory) {
    (, bytes memory returnData) = endPoint.staticcall(payload);
    return returnData;
  }

  function execute(address endPoint, address recipient, uint256 amount) public onlyOwner {
    bool success = Token(endPoint).transfer(recipient, amount);
    require(success, "Called contract failed execution");
  }
}
