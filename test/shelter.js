var Shelter = artifacts.require("./Shelter.sol");
var User = artifacts.require("./User.sol");

contract("Shelter", function(accounts) {
  var shelter;
  var user;
  var _owner = accounts[0];
  it('shelter-init', async function(){
    shelter = await Shelter.new("Singularity Shelter Provider", "providing shelter to the people of Singularity", {from:_owner});
    if(!shelter.address)
      throw new Error("no contract address");
  })
  it('add-shelter', async function(){
    var shelterName = "Jaaga Tent 27";
    var shelterDailyRate = web3.toWei(0.001,"ether");
    var shelterWeeklyRate = web3.toWei(0.007,"ether");
    var shelterMonthlyRate = web3.toWei(0.028,"ether");
    var shelterQuarterlyRate = web3.toWei(0.084, "ether");

    await shelter.addRentable(shelterName, shelterDailyRate,
      shelterWeeklyRate, shelterMonthlyRate, shelterQuarterlyRate)
    let rentableInfo = await shelter.rentables(shelterName);
    assert.equal(rentableInfo[0],true);
    assert.equal(rentableInfo[1].toString(),"0x4a616167612054656e7420323700000000000000000000000000000000000000");
    assert.equal(rentableInfo[2].toString(),shelterDailyRate);
    assert.equal(rentableInfo[3].toString(),shelterWeeklyRate);
    assert.equal(rentableInfo[4].toString(),shelterMonthlyRate);
    assert.equal(rentableInfo[5].toString(),shelterQuarterlyRate);
  })
  it('change-rate-shelter', async function(){
    var shelterName = "Jaaga Tent 27";
    var shelterDailyRate = web3.toWei(0.001,"ether");
    var shelterWeeklyRate = web3.toWei(0.007,"ether");
    var shelterMonthlyRate = web3.toWei(0.028,"ether");
    var shelterQuarterlyRate = web3.toWei(0.084, "ether");
    var newShelterDailyRate = web3.toWei(0.002,"ether");
    var newShelterWeeklyRate = web3.toWei(0.014,"ether");
    var newShelterMonthlyRate = web3.toWei(0.056,"ether");
    var newShelterQuarterlyRate = web3.toWei(0.112, "ether");

    let rentableInfo = await shelter.rentables(shelterName)
    assert.equal(rentableInfo[0],true);
    assert.equal(rentableInfo[1].toString(),"0x4a616167612054656e7420323700000000000000000000000000000000000000");
    assert.equal(rentableInfo[2].toString(),shelterDailyRate);
    assert.equal(rentableInfo[3].toString(),shelterWeeklyRate);
    assert.equal(rentableInfo[4].toString(),shelterMonthlyRate);
    assert.equal(rentableInfo[5].toString(),shelterQuarterlyRate);

    await shelter.changeDailyRate(shelterName, newShelterDailyRate);
    rentableInfo = await shelter.rentables(shelterName);
    assert.equal(rentableInfo[2].toString(),newShelterDailyRate);

    await shelter.changeWeeklyRate(shelterName, newShelterWeeklyRate);
    rentableInfo = await shelter.rentables(shelterName)
    assert.equal(rentableInfo[3].toString(),newShelterWeeklyRate);

    await shelter.changeMonthlyRate(shelterName, newShelterMonthlyRate);
    rentableInfo = await shelter.rentables(shelterName)
    assert.equal(rentableInfo[4].toString(),newShelterMonthlyRate);

    await shelter.changeQuarterlyRate(shelterName, newShelterQuarterlyRate);
    rentableInfo = await shelter.rentables(shelterName)
    assert.equal(rentableInfo[5].toString(),newShelterQuarterlyRate);
  })
  it('rent-out-shelter', async function(){
    var shelterName = "Jaaga Tent 27";
    var customer = accounts[4];
    user = await User.new("Shelter User", {from:customer});
    if(!user.address)
      throw new Error("no contract address");
    await user.registerToProvider(shelter.address);
    let serviceInfo =  await user.services(shelter.address);
    assert.equal(serviceInfo[2].toString(), 0);

    await shelter.rentRentable(shelterName, user.address);
    let rentableInfo = await shelter.rentables(shelterName);
    assert.equal(rentableInfo[6], user.address);
  })
  it('charge-user-for-shelter', async function(){
    var shelterName = "Jaaga Tent 27";
    var newShelterDailyRate = web3.toWei(0.002,"ether");
    var newShelterWeeklyRate = web3.toWei(0.014,"ether");
    var newShelterMonthlyRate = web3.toWei(0.056,"ether");
    var newShelterQuarterlyRate = web3.toWei(0.112, "ether");
    let serviceInfo = await user.services(shelter.address);
    assert.equal(serviceInfo[2].toString(),0);

    await shelter.chargeDailyRate(shelterName, user.address);
    serviceInfo = await user.services(shelter.address);
    assert.equal(serviceInfo[2].toString(), newShelterDailyRate);

    await shelter.chargeWeeklyRate(shelterName, user.address);
    serviceInfo = await user.services(shelter.address);
    assert.equal(serviceInfo[2].toString(), 16000000000000000);

    await shelter.chargeMonthlyRate(shelterName, user.address);
    serviceInfo = await user.services(shelter.address);
    assert.equal(serviceInfo[2].toString(), 72000000000000000);

    await shelter.chargeQuarterlyRate(shelterName, user.address);
    serviceInfo = await user.services(shelter.address);
    assert.equal(serviceInfo[2].toString(), 184000000000000000);
  })
})
