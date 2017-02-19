var Electricity = artifacts.require("./Electricity.sol")

contract("Electricity", function(accounts){
  var electricity;
  var _owner = accounts[0];
  it("electricity-init", function(){
    return Electricity.new("Singularity Electricity", "Electricity Provider for the Singularity",{from:_owner})
      .then(function(eletricityContract){
        if(eletricityContract.address){
          electricity = eletricityContract;
        } else {
          throw new Error("no contract address")
        }
      })
  })
})