var Electricity = artifacts.require("./Electricity.sol")

contract("Electricity", function(accounts){
  var electricity;
  var _owner = accounts[0];
  it("electricity-init", async function(){
    electricity = await Electricity.new("Singularity Electricity", "Electricity Provider for the Singularity",{from:_owner});
    if(!electricity.address)
      throw new Error("no contract address")
  })
})
