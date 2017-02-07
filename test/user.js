var User = artifacts.require("./User.sol");
var Provider = artifacts.require("./Provider.sol");

contract("User", function(accounts){
  var user;
  var provider;
  it("init", function(){
    return User.new("myUserName")
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
        user.payToProvider(provider.address)
        .then(function(txHash){
          console.log(txHash);
          return user.services(provider.address);
        })
        .then(function(serviceInfo){
          assert.equal(serviceInfo[2].c[0], 0);
        })
      })
  })
})
