pragma solidity ^0.4.6;

import "./Provider.sol";

contract Shelter is Provider {

  mapping (bytes32 => ShelterInfo) public shelters;

  struct ShelterInfo {
    bool active;
    bytes32 name;
    uint256 dailyRate;
    uint256 weelyRate;
    uint256 montlyRate;
    uint256 quarterlyRate;
    address occupant;
  }

  function Shelter(string _name, string _description) Provider("_name", "_description") {
    providerName = _name;
    description = _description;
  }

  function addShelter(bytes32 _name, uint256 _dailyRate, 
    uint256 _weelyRate, uint256 _montlyRate, uint256 _quarterlyRate) {
    shelters[_name] = ShelterInfo({
      active:true,
      name:_name,
      dailyRate:_dailyRate,
      weelyRate: _weelyRate,
      montlyRate: _montlyRate,
      quarterlyRate: _quarterlyRate,
      occupant: 0x0
      });
  }

  function changeDailyRate(bytes32 _name, uint256 _rate){
    shelters[_name].dailyRate = _rate;
  }

  function changeWeeklyRate(bytes32 _name, uint256 _rate){
    shelters[_name].weelyRate = _rate;
  }

  function changeMonthlyRate(bytes32 _name, uint256 _rate){
    shelters[_name].montlyRate = _rate;
  }

  function changeQuarterlyRate(bytes32 _name, uint256 _rate){
    shelters[_name].quarterlyRate = _rate;
  }

  function rentShelter(bytes32 _name, address _userAddress) {
    shelters[_name].occupant = _userAddress;
  }

  function chargeDailyRate(bytes32 _name, address _userAddress){
    setDebt(shelters[_name].dailyRate, _userAddress);
  }

  function chargeWeeklyRate(bytes32 _name, address _userAddress){
    setDebt(shelters[_name].weelyRate, _userAddress);
  }

  function chargeMonthlyRate(bytes32 _name, address _userAddress){
    setDebt(shelters[_name].montlyRate, _userAddress);
  }

  function chargeQuarterlyRate(bytes32 _name, address _userAddress){
    setDebt(shelters[_name].quarterlyRate, _userAddress);
  }

}