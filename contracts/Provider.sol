pragma solidity ^0.4.6;

import "./User.sol";

contract Provider {
  string public providerName;
  string public description;

  function Provider(string _name, string _description) {
    providerName = _name;
    description = _description;
  }

  function setDebt(uint256 _debt, address _userAddress) {
    User person = User(_userAddress);
    person.setDebt(_debt);
  }

  function recievePayment(address _userAddress) payable returns (bool result) {
    User person = User(_userAddress);
    person.clearDebt();
    return true;
  }
}