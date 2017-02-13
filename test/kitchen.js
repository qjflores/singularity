var Kitchen = artifacts.require("./Kitchen.sol");

contract("Kitchen", function(accounts) {
  var user;
  var kitchen;
  var balance = (acct) => {return web3.fromWei(web3.eth.getBalance(acct), 'ether').toNumber() }
  it('init', function(){
    return Kitchen.new("Kitchen1", "the farm kitchen").then(function(kitchenContract) {
      if(kitchenContract.address){
        kitchen = kitchenContract;
      } else {
        throw new Error("no contract address");
      }
      return true;
    })
  })
})