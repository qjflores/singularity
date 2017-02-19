var ConvertLib = artifacts.require("./ConvertLib.sol");
var MetaCoin = artifacts.require("./MetaCoin.sol");
var User = artifacts.require("./User.sol");
var Provider = artifacts.require("./Provider.sol");
var RentableProvider = artifacts.require("./RentableProvider.sol");
var Kitchen = artifacts.require("./Kitchen.sol");
var Teacher = artifacts.require("./Teacher.sol");
var Course = artifacts.require("./Course.sol");
var Bank = artifacts.require("./Bank.sol");
var Shelter = artifacts.require("./Shelter.sol");
var Water = artifacts.require("./Water.sol");
var Internet = artifacts.require("./Internet.sol");

module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, MetaCoin);
  deployer.deploy(MetaCoin);
  deployer.deploy(User);
  deployer.deploy(Provider);
  deployer.deploy(RentableProvider);
  deployer.deploy(Kitchen);
  deployer.deploy(Teacher);
  deployer.deploy(Course);
  deployer.deploy(Bank);
  deployer.deploy(Shelter);
  deployer.deploy(Water);
  deployer.deploy(Internet);
};
