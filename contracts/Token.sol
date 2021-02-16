pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/*
A standard ERC20 token using openzeppelin
*/
contract Token is ERC20 {
  constructor () public ERC20("TrulyWorthless", "TWC") {
    _setupDecimals(2);
    _mint(msg.sender, 1000000000 * (10 ** uint256(decimals())));
  }
}
