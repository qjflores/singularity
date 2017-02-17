var Kitchen = artifacts.require("./Kitchen.sol");
var User = artifacts.require("./User.sol");

contract("Kitchen", function(accounts) {
  var kitchen;
  var user;
  var staff;
  var version = "v0.1.0";
  var _owner = accounts[0];
  var _staff1 = accounts[1];
  var balance = (acct) => {return web3.fromWei(web3.eth.getBalance(acct), 'ether').toNumber() }
  it('init', function() {
    return Kitchen.new({from:_owner}).then(function(kitchenContract) {
      if(kitchenContract.address){
        kitchen = kitchenContract;
      } else {
        throw new Error("no contract address");
      }
      return true;
    })
  })
  it('test-user-to-staff', function() {
    return User.new("StaffUser", {from:_staff1})
      .then(function(userContract){
        if (userContract.address) {
          staff = userContract;
        } else {
          throw new Error("no contract address");
        }
        return true
      })
      .then(function(value){
        return kitchen.addStaff(staff.address, {from:_owner})
      })
      .then(function(txHash) {
        return kitchen.staffList(staff.address);
      })
      .then(function(staffInfo){
        assert.equal(staffInfo[0], true);
      })
  })
  it('add-item-to-menu', function(){
    var _name = "lunch";
    var _price = web3.toWei(0.5,"ether");
    return kitchen.addItemToMenu(_name, _price, {from:_owner})
      .then(function(txHash){
        return kitchen.menu(_name);
      })
      .then(function(itemInfo){
        assert.equal(itemInfo[0], '0x6c756e6368000000000000000000000000000000000000000000000000000000');
        assert.equal(itemInfo[1].toString(), web3.toWei(0.5,"ether"));
      })
  })
  it('add-multiple-items-to-user-debt', function(){
    var _item1 = "iddly";
    var _price1 = web3.toWei(0.01, "ether");
    var _quantity1 = 2;
    var _item2 = "vada";
    var _quantity2 = 1;
    var _price2 = web3.toWei(0.02, "ether");
    return kitchen.addItemToMenu(_item1, _price1, {from:_owner})
      .then(function(txHash){
        return kitchen.addItemToMenu(_item1, _price1, {from:_owner})
      })
      .then(function(txHash){
        return kitchen.addItemToMenu(_item2, _price2, {from:_owner})
      })
      .then(function(txHash){
        return User.new("myUserName", {from:accounts[2]})
      })
      .then(function(userContract){
        if(userContract.address){
          user = userContract;
        } else {
          throw new Error("no contract address")
        }
        return true
      })
      .then(function(value){
        assert.equal(0, web3.toWei(balance(kitchen.address),"ether"));
        return true
      })
      .then(function(value){
        return user.registerToProvider(kitchen.address);
      })
      .then(function(txHash){
        return user.services(kitchen.address);
      })
      .then(function(serviceInfo){
        // assert that the initial debt to the kitchen is 0
        assert.equal(0, serviceInfo[2].toString());
        return kitchen.addItemToUserDebt(user.address, _item1)
      })
      .then(function(txHash){
        return user.services(kitchen.address);
      })
      .then(function(serviceInfo){
        assert.equal(_price1, serviceInfo[2].toString());
        return kitchen.addItemToUserDebt(user.address, _item2)
      })
      .then(function(txHash){
        return user.services(kitchen.address);
      })
      .then(function(serviceInfo){
        assert.equal(30000000000000000, serviceInfo[2].toString());
        return user.services(kitchen.address);
      })
      .then(function(serviceInfo){
        return kitchen.recievePayment(user.address,{from:accounts[2],value:serviceInfo[2].toString()})
      })
      .then(function(txHash){
        return user.services(kitchen.address);
      })
      .then(function(serviceInfo){
        assert.equal(0, serviceInfo[2].toString());
        assert.equal(0.03, balance(kitchen.address));
      })
  })
  it('change-item-price', function(){
    var item1 = "iddly";
    var newPrice = web3.toWei(0.02, "ether");
    return kitchen.menu(item1)
      .then(function(itemInfo){
        // item struct
        assert.equal(itemInfo[0], '0x6964646c79000000000000000000000000000000000000000000000000000000');
        assert.equal(itemInfo[1].toString(), 10000000000000000);
        return kitchen.updateItemPrice(item1, newPrice);
      })
      .then(function(txHash){
        return kitchen.menu(item1)
      })
      .then(function(itemInfo){
        assert.equal(itemInfo[1].toString(), 20000000000000000);
      })
  })
  it('add-job-to-contract', function(){
    var jobName = "Lead cook";
    var jobRate = web3.toWei(0.001, "ether");
    return kitchen.addJob(jobName, jobRate, {from: _owner})
      .then(function(txHash){
        return kitchen.jobs(jobName)
      })
      .then(function(jobInfo){
        assert.equal(jobInfo[0], '0x4c65616420636f6f6b0000000000000000000000000000000000000000000000');
        assert.equal(jobInfo[1].toString(), 1000000000000000);
      })
  })
  it('change-job-rate', function(){
    var jobName = "Lead cook";
    var newJobRate = web3.toWei(0.002, "ether");
    return kitchen.jobs(jobName)
      .then(function(jobInfo){
        // job rate stored in a struct
        assert.equal(jobInfo[1].toString(), 1000000000000000);
        return kitchen.updateJobRate(jobName, newJobRate)
      })
      .then(function(txHash){
        return kitchen.jobs(jobName)
      })
      .then(function(jobInfo){
        assert.equal(jobInfo[1].toString(), 2000000000000000);
      })
  })
  it('pay-out-job', function(){
    var jobName = "Lead cook";
    assert.equal(balance(kitchen.address), 0.03);
    return kitchen.jobs(jobName)
      .then(function(jobInfo){
        return kitchen.payOutJob(staff.address, jobName)
      })
      .then(function(txHash){
        return kitchen.staffList(staff.address);
      })
      .then(function(staffInfo){
        //this is the payout stored in a struct
        assert.equal(staffInfo[2].toString(), 2000000000000000);
        return kitchen.collectPayout(staff.address)
      .then(function(txHash){
        return kitchen.staffList(staff.address);
      })
      .then(function(staffInfo){
        assert.equal(balance(kitchen.address), 0.028);
        assert.equal(staffInfo[2].toString(), 0);
        assert.equal(balance(staff.address), web3.fromWei(2000000000000000, "ether"));
        assert.equal(balance(kitchen.address), web3.fromWei(28000000000000000, "ether"));
      })
    })
  })
})