var Water = artifacts.require("./Water.sol");

contract("Water", function(accounts){
  var water;
  var _owner = accounts[0];
  it("water-init", function(){
    return Water.new("Singularity Water", "Water Provider for the Singularity",{from:_owner})
      .then(function(waterContract){
        if(waterContract.address){
          water = waterContract;
        } else {
          throw new Error("no contract address")
        }
      })
  })
})