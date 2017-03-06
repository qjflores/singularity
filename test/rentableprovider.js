var RentableProvider = artifacts.require("./RentableProvider.sol");

contract("RentableProvider", function(accounts){
  var rentableprovider;
  it('rentableprovider-init', async function(){
    rentableprovider = await RentableProvider.new("Singularty RentableProvider", "Providers in the Singularty that provide daily, weekly, monthly, services.");
    if(!rentableprovider.address)
      throw new Error("no contract address");
  })
})
