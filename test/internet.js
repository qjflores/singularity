var Internet = artifacts.require("./Internet.sol");

contract("Internet", function(accounts){
  var internet;
  var _owner = accounts[0];
  it("internet-init", function(){
    return Internet.new("Singularity Internet", "Internet Provider for the Singularity",{from:_owner})
      .then(function(internetContract){
        if(internetContract.address){
          internet = internetContract;
        } else {
          throw new Error("no contract address")
        }
      })
  })
})