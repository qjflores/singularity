var ConvertLib = artifacts.require("./ConvertLib.sol");
var MetaCoin = artifacts.require("./MetaCoin.sol");
var User = artifacts.require("./User.sol");
var Provider = artifacts.require("./Provider.sol");
var Kitchen = artifacts.require("./Kitchen.sol");
var Teacher = artifacts.require("./Teacher.sol");
var Course = artifacts.require("./Course.sol");
var Bank = artifacts.require("./Bank.sol");

module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, MetaCoin);
  deployer.deploy(MetaCoin);
  deployer.deploy(User);
  deployer.deploy(Provider);
  deployer.deploy(Kitchen);
  deployer.deploy(Teacher);
  deployer.deploy(Course);
  deployer.deploy(Bank);
};
