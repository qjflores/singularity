pragma solidity ^0.4.6;

contract User {
  string public userName;

  mapping (address => Service) public services;

  struct Service{
    bool active;
    uint lastUpdated;
    uint256 debt;
  }

  function User(string _name) payable {
    userName = _name;
  }

  function registerToProvider(address _providerAddress){
    services[_providerAddress] = Service({
      active:true,
      lastUpdated: now,
      debt: 0
      });
  }

  function setDebt(uint256 _debt){
    if(services[msg.sender].active){
      services[msg.sender].lastUpdated = now;
      services[msg.sender].debt = _debt;
      } else {
        throw;
      }
  }

  function payToProvider(address _providerAddress) payable {
    if(_providerAddress.send(services[_providerAddress].debt))
      throw;
  }

  function payToProvider1(address _providerAddress) returns (bool) {
    // using a withdrawl message
    uint amount = services[_providerAddress].debt;
    services[_providerAddress].debt = 0;
    if ( _providerAddress.send(amount)) {
      return true;
    } else {
      services[_providerAddress].debt = amount;
      return false;
    }
  }


}