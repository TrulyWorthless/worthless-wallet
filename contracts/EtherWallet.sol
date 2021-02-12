pragma solidity ^0.6.0;

import "./Ownable.sol";

contract EtherWallet is Ownable {
  event EtherTransfer(address indexed recipient, uint256 amount);
  event EtherReceived(address indexed sender, uint256 amount);

  constructor () public Ownable() {}

  function getBalance() public view returns (uint256) {
    return address(this).balance;
  }

  function send(address recipient) external payable onlyOwner returns (bool) {
    (bool sent,) = recipient.call{value: msg.value}("");
    require(sent, "EtherWallet: failed to send ether");
    emit EtherTransfer(recipient, msg.value);
    return true;
  }

  function send(address recipient, uint256 amount) external onlyOwner returns (bool) {
    require(getBalance() >= amount, "EtherWallet: insufficient ether balance");
    (bool sent,) = recipient.call{value: amount}("");
    require(sent, "EtherWallet: failed to send ether");
    emit EtherTransfer(recipient, amount);
    return true;
  }

  receive() external payable {
    emit EtherReceived(msg.sender, msg.value);
  }

  fallback() external payable {}
}
