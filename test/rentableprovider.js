var RentableProvider = artifacts.require("./RentableProvider.sol");

contract("RentableProvider", function(accounts){
  var rentableprovider;
  it('rentableprovider-init', function(){
    return RentableProvider.new("Singularty RentableProvider", "Providers in the Singularty that provide daily, weekly, monthly, services.")
    .then(function(rentableProviderContract){
      if(rentableProviderContract.address){
        rentableprovider = rentableProviderContract;
      } else {
        throw new Error("no contract address");
      }
    })
  })
})