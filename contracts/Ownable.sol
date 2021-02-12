pragma solidity ^0.6.0;

abstract contract Ownable {
  mapping(address => bool) internal _owners;
  uint256 ownerCount;

  event OwnerAdded(address indexed newOwner);
  event OwnerRemoved(address indexed previousOwner);

  constructor () internal {
    _owners[msg.sender] = true;
    ownerCount++;
    emit OwnerAdded(msg.sender);
  }

  function isOwner(address owner) public view returns (bool) {
    return _owners[owner];
  }

  function addOwner(address newOwner) public onlyOwner {
    _owners[newOwner] = true;
    emit OwnerAdded(newOwner);
  }

  function removeOwner(address previousOwner) public onlyOwner {
    require(ownerCount > 1, "Ownable: no remaining owners");
    _owners[previousOwner] = false;
    emit OwnerRemoved(previousOwner);
  }

  modifier onlyOwner() {
    require(_owners[msg.sender], "Ownable: caller is not an owner");
    _;
  }
}
