var User = artifacts.require("./User.sol");
var Provider = artifacts.require("./Provider.sol");

contract("User", function(accounts){
  var user;
  var provider;
  var balance = (acct) => {return web3.fromWei(web3.eth.getBalance(acct), 'ether').toNumber() }
  it("init", async function(){
    user = await User.new("myUserName", {from:accounts[1]});
    if(!user.address)
      throw new Error("no contract address");
    let userName = await user.userName();
    assert.equal(userName, "myUserName");
  })
  it("register-with-a-service-provider-then-set-debt-then-pay-debt", async function(){
    provider = await Provider.new("provider1", "provider of service 1");
    if(!provider.address)
      throw new Error("no contract address");

    assert.equal(0, web3.toWei(balance(provider.address),"ether"));
    await user.registerToProvider(provider.address);
    let serviceInfo = await user.services(provider.address);
    assert.equal(serviceInfo[0], true);
    // TODO use the block number instead of time for last updated
    //assert.equal(serviceInfo[1].c[0], 1486464963);
    assert.equal(serviceInfo[2].c[0], 0);
    await provider.setDebt(web3.toWei(10,"ether"), user.address);
    serviceInfo = await user.services(provider.address);
    assert.equal(serviceInfo[2].c[0], 100000);
    await provider.recievePayment(user.address,{from:accounts[1], value:serviceInfo[2].c[0]});
    serviceInfo = await user.services(provider.address);
    assert.equal(serviceInfo[2].c[0], 0);
    assert.equal(100000,web3.toWei(balance(provider.address),"ether"));
  })
})
