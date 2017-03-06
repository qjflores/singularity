var Internet = artifacts.require("./Internet.sol");

contract("Internet", function(accounts){
  var internet;
  var _owner = accounts[0];
  it("internet-init", async function(){
    internet = await Internet.new("Singularity Internet", "Internet Provider for the Singularity",{from:_owner});
    if(!internet.address)
      throw new Error("no contract address")
  })
})
