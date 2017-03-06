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
  it('init', async function() {
    kitchen = await Kitchen.new({from:_owner});
    if(!kitchen.address)
      throw new Error("no contract address");
  })
  it('test-user-to-staff', async function() {
    staff = await User.new("StaffUser", {from:_staff1});
    if(!staff.address)
      throw new Error("no contract address");
    await kitchen.addStaff(staff.address, {from:_owner});
    let staffInfo = await kitchen.staffList(staff.address);
    assert.equal(staffInfo[0], true);
  })
  it('add-item-to-menu', async function(){
    var _name = "lunch";
    var _price = web3.toWei(0.5,"ether");
    await kitchen.addItemToMenu(_name, _price, {from:_owner});
    let itemInfo = await kitchen.menu(_name);
    assert.equal(itemInfo[0], '0x6c756e6368000000000000000000000000000000000000000000000000000000');
    assert.equal(itemInfo[1].toString(), web3.toWei(0.5,"ether"));
  })
  it('add-multiple-items-to-user-debt', async function(){
    var _item1 = "iddly";
    var _price1 = web3.toWei(0.01, "ether");
    var _quantity1 = 2;
    var _item2 = "vada";
    var _quantity2 = 1;
    var _price2 = web3.toWei(0.02, "ether");
    await kitchen.addItemToMenu(_item1, _price1, {from:_owner});
    await kitchen.addItemToMenu(_item2, _price2, {from:_owner});
    user = await User.new("myUserName", {from:accounts[2]});
    if(!user.address)
      throw new Error("no contract address");

    assert.equal(0, web3.toWei(balance(kitchen.address),"ether"));
    await user.registerToProvider(kitchen.address);
    let serviceInfo = await user.services(kitchen.address);
    // assert that the initial debt to the kitchen is 0
    assert.equal(0, serviceInfo[2].toString());
    await kitchen.addItemToUserDebt(user.address, _item1);

    serviceInfo = await user.services(kitchen.address);
    assert.equal(_price1, serviceInfo[2].toString());
    await kitchen.addItemToUserDebt(user.address, _item2);

    serviceInfo = await user.services(kitchen.address);
    assert.equal(30000000000000000, serviceInfo[2].toString());

    serviceInfo = await user.services(kitchen.address);
    await kitchen.recievePayment(user.address,{from:accounts[2],value:serviceInfo[2].toString()});

    serviceInfo = await user.services(kitchen.address);
    assert.equal(0, serviceInfo[2].toString());
    assert.equal(0.03, balance(kitchen.address));
  })
  it('change-item-price', async function(){
    var item1 = "iddly";
    var newPrice = web3.toWei(0.02, "ether");
    let itemInfo = await kitchen.menu(item1);
    assert.equal(itemInfo[0], '0x6964646c79000000000000000000000000000000000000000000000000000000');
    assert.equal(itemInfo[1].toString(), 10000000000000000);
    await kitchen.updateItemPrice(item1, newPrice);

    itemInfo = await kitchen.menu(item1);
    assert.equal(itemInfo[1].toString(), 20000000000000000);
  })
  it('add-job-to-contract', async function() {
    var jobName = "Lead cook";
    var jobRate = web3.toWei(0.001, "ether");
    await kitchen.addJob(jobName, jobRate, {from: _owner});
    let jobInfo = await kitchen.jobs(jobName);
    assert.equal(jobInfo[0], '0x4c65616420636f6f6b0000000000000000000000000000000000000000000000');
    assert.equal(jobInfo[1].toString(), 1000000000000000);
  })
  it('change-job-rate', async function(){
    var jobName = "Lead cook";
    var newJobRate = web3.toWei(0.002, "ether");
    let jobInfo = await kitchen.jobs(jobName);
    // job rate stored in a struct
    assert.equal(jobInfo[1].toString(), 1000000000000000);
    await kitchen.updateJobRate(jobName, newJobRate);
    jobInfo = await kitchen.jobs(jobName);
    assert.equal(jobInfo[1].toString(), 2000000000000000);
  })
  it('pay-out-job', async function(){
    var jobName = "Lead cook";
    assert.equal(balance(kitchen.address), 0.03);
    let jobInfo = await kitchen.jobs(jobName);
    await kitchen.payOutJob(staff.address, jobName);
    let staffInfo = await kitchen.staffList(staff.address);
    //this is the payout stored in a struct
    assert.equal(staffInfo[2].toString(), 2000000000000000);
    await kitchen.collectPayout(staff.address)
    staffInfo = await kitchen.staffList(staff.address);
    assert.equal(balance(kitchen.address), 0.028);
    assert.equal(staffInfo[2].toString(), 0);
    assert.equal(balance(staff.address), web3.fromWei(2000000000000000, "ether"));
    assert.equal(balance(kitchen.address), web3.fromWei(28000000000000000, "ether"));
  })
})
