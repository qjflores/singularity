var Shelter = artifacts.require("./Shelter.sol");
var User = artifacts.require("./User.sol");

contract("Shelter", function(accounts) {
  var shelter;
  var user;
  var _owner = accounts[0];
  it('shelter-init', function(){
    return Shelter.new("Singularity Shelter Provider", "providing shelter to the people of Singularity", {from:_owner})
      .then(function(shelterContract){
        if(shelterContract.address) {
          shelter = shelterContract;
        } else {
          throw new Error("no contract address");
        }
      })
  })
  it('add-shelter', function(){
    var shelterName = "Jaaga Tent 27";
    var shelterDailyRate = web3.toWei(0.001,"ether");
    var shelterWeeklyRate = web3.toWei(0.007,"ether");
    var shelterMonthlyRate = web3.toWei(0.028,"ether");
    var shelterQuarterlyRate = web3.toWei(0.084, "ether");

    return shelter.addRentable(shelterName, shelterDailyRate, 
      shelterWeeklyRate, shelterMonthlyRate, shelterQuarterlyRate)
      .then(function(txHash){
        return shelter.rentables(shelterName)
      })
      .then(function(rentableInfo){
        assert.equal(rentableInfo[0],true);
        assert.equal(rentableInfo[1].toString(),"0x4a616167612054656e7420323700000000000000000000000000000000000000");
        assert.equal(rentableInfo[2].toString(),shelterDailyRate);
        assert.equal(rentableInfo[3].toString(),shelterWeeklyRate);
        assert.equal(rentableInfo[4].toString(),shelterMonthlyRate);
        assert.equal(rentableInfo[5].toString(),shelterQuarterlyRate);
      })

  })
  it('change-rate-shelter', function(){
    var shelterName = "Jaaga Tent 27";
    var shelterDailyRate = web3.toWei(0.001,"ether");
    var shelterWeeklyRate = web3.toWei(0.007,"ether");
    var shelterMonthlyRate = web3.toWei(0.028,"ether");
    var shelterQuarterlyRate = web3.toWei(0.084, "ether");
    var newShelterDailyRate = web3.toWei(0.002,"ether");
    var newShelterWeeklyRate = web3.toWei(0.014,"ether");
    var newShelterMonthlyRate = web3.toWei(0.056,"ether");
    var newShelterQuarterlyRate = web3.toWei(0.112, "ether");
    return shelter.rentables(shelterName)
      .then(function(rentableInfo){
        assert.equal(rentableInfo[0],true);
        assert.equal(rentableInfo[1].toString(),"0x4a616167612054656e7420323700000000000000000000000000000000000000");
        assert.equal(rentableInfo[2].toString(),shelterDailyRate);
        assert.equal(rentableInfo[3].toString(),shelterWeeklyRate);
        assert.equal(rentableInfo[4].toString(),shelterMonthlyRate);
        assert.equal(rentableInfo[5].toString(),shelterQuarterlyRate);
        return shelter.changeDailyRate(shelterName, newShelterDailyRate)
      })
      .then(function(txHash){
        return shelter.rentables(shelterName)
      })
      .then(function(rentableInfo){
        assert.equal(rentableInfo[2].toString(),newShelterDailyRate);
        return shelter.changeWeeklyRate(shelterName, newShelterWeeklyRate)
      })
      .then(function(txHash){
        return shelter.rentables(shelterName)
      })
      .then(function(rentableInfo){
        assert.equal(rentableInfo[3].toString(),newShelterWeeklyRate);
        return shelter.changeMonthlyRate(shelterName, newShelterMonthlyRate) 
      })
      .then(function(txHash){
        return shelter.rentables(shelterName)
      })
      .then(function(rentableInfo){
        assert.equal(rentableInfo[4].toString(),newShelterMonthlyRate);
        return shelter.changeQuarterlyRate(shelterName, newShelterQuarterlyRate) 
      })
      .then(function(txHash){
        return shelter.rentables(shelterName)
      })
      .then(function(rentableInfo){
        assert.equal(rentableInfo[5].toString(),newShelterQuarterlyRate);
      })

  })
  it('rent-out-shelter', function(){
    var shelterName = "Jaaga Tent 27";
    var customer = accounts[4];
    return User.new("Shelter User", {from:customer})
      .then(function(userContract){
        if(userContract.address){
          user = userContract;
        } else {
          throw new Error("no contract address");
        }
        return true;
      })
      .then(function(value){
        return user.registerToProvider(shelter.address);
      })
      .then(function(txHash){
        return user.services(shelter.address)
      })
      .then(function(serviceInfo){
        assert.equal(serviceInfo[2].toString(), 0)
        return shelter.rentRentable(shelterName ,user.address)
      })
      .then(function(txHash){
        return shelter.rentables(shelterName)
      })
      .then(function(rentableInfo){
        assert.equal(rentableInfo[6],user.address)
      })
  })
  it('charge-user-for-shelter', function(){
    var shelterName = "Jaaga Tent 27";
    var newShelterDailyRate = web3.toWei(0.002,"ether");
    var newShelterWeeklyRate = web3.toWei(0.014,"ether");
    var newShelterMonthlyRate = web3.toWei(0.056,"ether");
    var newShelterQuarterlyRate = web3.toWei(0.112, "ether");
    return user.services(shelter.address)
    .then(function(serviceInfo){
      assert.equal(serviceInfo[2].toString(),0)
      return shelter.chargeDailyRate(shelterName, user.address)
    })
    .then(function(txHash){
      return user.services(shelter.address)
    })
    .then(function(serviceInfo){
      assert.equal(serviceInfo[2].toString(), newShelterDailyRate)
      return shelter.chargeWeeklyRate(shelterName, user.address)
    })
    .then(function(txHash){
      return user.services(shelter.address)
    })
    .then(function(serviceInfo){
      assert.equal(serviceInfo[2].toString(), 16000000000000000)
      return shelter.chargeMonthlyRate(shelterName, user.address)
    })
    .then(function(txHash){
      return user.services(shelter.address)
    })
    .then(function(serviceInfo){
      assert.equal(serviceInfo[2].toString(), 72000000000000000)
      return shelter.chargeQuarterlyRate(shelterName, user.address)
    })
    .then(function(txHash){
      return user.services(shelter.address)
    })
    .then(function(serviceInfo){
      assert.equal(serviceInfo[2].toString(), 184000000000000000)
    })
  })
})