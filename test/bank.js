var Bank = artifacts.require("./Bank.sol");

contract("Bank", function(accounts){
  var bank;
  var _owner = accounts[0];
  var banker = accounts[1];
  var customer = accounts[2];
  var balance = (acct) => {return web3.fromWei(web3.eth.getBalance(acct), 'ether').toNumber() }
  it('bank-init', function(){
    var bankName = "Singularity Bank";
    return Bank.new(bankName, {from:_owner, value:web3.toWei(50,"ether")})
      .then(function(bankContract){
        if(bankContract.address) {
          bank = bankContract;
        } else {
          throw new Error("no contract address")
        }
        return true;
      })
      .then(function(value){
        assert.equal(balance(bank.address), 50)
      })
  })
  it('customer-exchange-inr', function(){
    var amount = 15000;
    var denomination = 'INR';
    var conversionRate = 861.05037710;
    var order = amount / conversionRate;
    var beginningBalance = balance(customer);
    assert.equal(balance(bank.address), 50)
    return bank.customerExchangeFiat(web3.toWei(order, "ether"), customer, "deposit")
      .then(function(txHash){
        assert.equal(balance(bank.address), 50-order);
        assert.equal(balance(customer), beginningBalance+order);
        beginningBalance = beginningBalance+order;
      })
  })
  it('customer-exchange-ether', function(){
    var amount = 17; //ether
    var beginningBalance = balance(customer);
    assert.equal(balance(bank.address), 32.579416490682355);
    return bank.customerExchangeEther(web3.toWei(amount, "ether"), customer, "withdrawl", {from:customer, value:web3.toWei(amount, "ether")})
      .then(function(txHash){
        assert.equal(balance(bank.address), 32.57941649068235550+amount);
        assert.equal(balance(customer), 100.41150110931764);
      })
  })
})