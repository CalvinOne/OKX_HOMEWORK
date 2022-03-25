const { ethers, network } = require("hardhat");
const { writeAddr } = require("./artifact_log.js");

const UniswapV2Factory = require(`../node_modules/@uniswap/v2-core/build/UniswapV2Factory.json`);
const Router = require(`../node_modules/@uniswap/v2-periphery/build/Router.json`);
const WETH = require(`../node_modules/@uniswap/v2-periphery/build/WETH.json`);
const MasterChef = require(`../deployments/${network.name}/MasterChef.json`);

async function main() {
  const [owner] = await ethers.getSigners();
  console.log("Owner address:", owner.address);

  // 1. deploy MyToken
  const Token = await ethers.getContractFactory("Token");
  const tokenAmount = ethers.utils.parseUnits("100000", 18);
  const token = await Token.deploy("MyToken", "$2321", tokenAmount);
  await token.deployed();
  console.log("MyToken address: ", token.address);
  await writeAddr(token.address, "Token", network.name);

  // 2. deploy MyTokenMarket
  const MyTokenMarket = await ethers.getContractFactory("MyTokenMarket");
  const market = await MyTokenMarket.deploy(
    token.address,
    Router.address,
    WETH.address,
    MasterChef.address,
    UniswapV2Factory.address
  );
  await market.deployed();
  console.log("MyTokenMarket address: ", market.address);
  await writeAddr(market.address, "MyTokenMarket", network.name);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });