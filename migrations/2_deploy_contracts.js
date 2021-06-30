var ERC20 = artifacts.require("./ERC20Token.sol");

module.exports = function(deployer) {
  deployer.deploy(ERC20, 1000000000000);
};