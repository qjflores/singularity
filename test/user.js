var User = artifacts.require("./User.sol");
var Provider = artifacts.require("./Provider.sol");

contract("User", function(accounts){
  var user;
  var provider;
  var balance = (acct) => {return web3.fromWei(web3.eth.getBalance(acct), 'ether').toNumber() }
  it("init", function(){
    return User.new("myUserName", {from:accounts[1]})
      .then(function(userContract){
        if(userContract.address){
          user = userContract;
        } else {
          throw new Error("no contract address");
        }
        return true;
      })
      .then(function(value){
        return user.userName.call()
      })
      .then(function(userName){
        assert.equal(userName, "myUserName");
      })
  })
  it("register-with-a-service-provider-then-set-debt-then-pay-debt",function(){
    return Provider.new("provider1", "provider of service 1")
      .then(function(providerContract){
        if(providerContract.address){
          provider = providerContract;
        } else {
          throw new Error("no contract address");
        }
        return true;
      })
      .then(function(value){
        assert.equal(0, web3.toWei(balance(provider.address),"ether"));
        return user.registerToProvider(provider.address);
      })
      .then(function(txHash){
        return user.services(provider.address)
      })
      .then(function(serviceInfo){
        assert.equal(serviceInfo[0], true);
        // TODO use the block number instead of time for last updated
        //assert.equal(serviceInfo[1].c[0], 1486464963);
        assert.equal(serviceInfo[2].c[0], 0);
        return provider.setDebt(web3.toWei(10,"ether"), user.address)
      })
      .then(function(txHash){
        return user.services(provider.address)
      })
      .then(function(serviceInfo){
        assert.equal(serviceInfo[2].c[0], 100000);
        return provider.recievePayment(user.address,{from:accounts[1], value:serviceInfo[2].c[0]})
      })
      .then(function(txHash){
        return user.services(provider.address);
      })
      .then(function(serviceInfo){
        assert.equal(serviceInfo[2].c[0], 0);
        return true;
      })
      .then(function(value){
        assert.equal(100000,web3.toWei(balance(provider.address),"ether"));
      })
  })
})
