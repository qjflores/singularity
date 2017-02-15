var Kitchen = artifacts.require("./Kitchen.sol");
var User = artifacts.require("./User.sol");

contract("Kitchen", function(accounts) {
  var kitchen;
  var user;
  var version = "v0.1.0";
  var _owner = accounts[0];
  var _staff1 = accounts[1];
  var balance = (acct) => {return web3.fromWei(web3.eth.getBalance(acct), 'ether').toNumber() }
  it('init', function() {
    return Kitchen.new().then(function(kitchenContract) {
      if(kitchenContract.address){
        kitchen = kitchenContract;
      } else {
        throw new Error("no contract address");
      }
      return true;
    })
  })
  it('test-user-to-staff', function() {
    return kitchen.addStaff(_staff1.toString(), {from:_owner})
      .then(function(txHash) {
        return kitchen.staffList(_staff1);
      })
      .then(function(staffInfo){
        assert.equal(staffInfo[0], true);
      })
  })
  it('add-item-to-menu', function(){
    var _name = "lunch";
    var _price = web3.toWei(0.1);
    return kitchen.addItemToMenu(_name, _price, {from:_owner})
      .then(function(txHash){
        return kitchen.menu(_name);
      })
      .then(function(itemInfo){
        assert.equal(itemInfo[0], '0x6c756e6368000000000000000000000000000000000000000000000000000000');
        assert.equal(itemInfo[1].c[0], 1000);
      })
  })
  it('add-multiple-items-to-user-debt', function(){
    var _item1 = "iddly";
    var _price1 = web3.toWei(0.001, "ether");
    var _quantity1 = 2;
    var _item2 = "vada";
    var _quantity2 = 1;
    var _price2 = web3.toWei(0.005, "ether");
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
        assert.equal(0, serviceInfo[2].c[0]);
        return kitchen.addItemToUserDebt(user.address, _item1)
      })
      .then(function(txHash){
        return user.services(kitchen.address);
      })
      .then(function(serviceInfo){
        assert.equal(10, serviceInfo[2].c[0]);
        return kitchen.addItemToUserDebt(user.address, _item2)
      })
      .then(function(txHash){
        return user.services(kitchen.address);
      })
      .then(function(serviceInfo){
        assert.equal(60,serviceInfo[2].c[0]);
        return user.services(kitchen.address);
      })
      .then(function(serviceInfo){
        return kitchen.recievePayment(user.address,{from:accounts[2],value:serviceInfo[2].c[0]})
      })
      .then(function(txHash){
        return user.services(kitchen.address);
      })
      .then(function(serviceInfo){
        assert.equal(0, serviceInfo[2].c[0]);
        assert.equal(60, web3.toWei(balance(kitchen.address),"ether"));
      })
  })
  it('change-item-price', function(){
    var item1 = "iddly";
    var newPrice = web3.toWei(0.002, "ether");
    return kitchen.menu(item1)
      .then(function(itemInfo){
        assert.equal(itemInfo[0], '0x6964646c79000000000000000000000000000000000000000000000000000000');
        assert.equal(itemInfo[1].c[0], 10);
        return kitchen.updateItemPrice(item1, newPrice);
      })
      .then(function(txHash){
        return kitchen.menu(item1)
      })
      .then(function(itemInfo){
        assert.equal(itemInfo[1].c[0], 20);
      })
  })
})