var Water = artifacts.require("./Water.sol");

contract("Water", function(accounts){
  var water;
  var _owner = accounts[0];
  it("water-init", async function(){
    water = await Water.new("Singularity Water", "Water Provider for the Singularity",{from:_owner});
    if(!water.address)
      throw new Error("no contract address")
  })
})
