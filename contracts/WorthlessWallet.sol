pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./Ownable.sol";

contract WorthlessWallet is Ownable {
  address internal owner;
  constructor () public Ownable() {

  }
}
