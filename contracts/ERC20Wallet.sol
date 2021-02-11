pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./Ownable.sol";

contract ERC20Wallet is Ownable {
  event ERC20Transer(ERC20 indexed _token, address indexed recipient, uint256 amount);
  event ERC20Approval(ERC20 indexed _token, address indexed spender, uint256 amount);
  event ERC20Spend(ERC20 indexed _token, address indexed spender, address indexed recipient, uint256 amount);

  constructor () public Ownable() {}

  function tokenTransfer(ERC20 _token, address recipient, uint256 amount) public onlyOwner {
    _token.transfer(recipient, amount);
    emit ERC20Transer(_token, recipient, amount);
  }

  function tokenApproval(ERC20 _token, address spender, uint256 amount) public onlyOwner {
    _token.approve(spender, amount);
    emit ERC20Approval(_token, spender, amount);
  }

  function tokenTransferFrom(ERC20 _token, address spender, address recipient, uint256 amount) public onlyOwner {
    _token.transferFrom(spender, recipient, amount);
    emit ERC20Spend(_token, spender, recipient, amount);
  }

  function getAllowance(ERC20 _token, address spender) public view returns (uint256) {
    return _token.allowance(spender, address(this));
  }

  function getAllowanceApproved(ERC20 _token, address spender) public view returns (uint256) {
    return _token.allowance(address(this), spender);
  }

  function getToken(ERC20 _token) public view returns (string memory, string memory, uint8, uint256, uint256) {
    return (_token.name(), _token.symbol(), _token.decimals(), _token.totalSupply(), _token.balanceOf(address(this)));
  }
}
