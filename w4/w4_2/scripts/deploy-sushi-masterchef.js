const { ethers, network } = require("hardhat");
const { writeAddr } = require("./artifact_log.js");

async function main() {
  const [owner] = await ethers.getSigners();
  console.log("Owner address:", owner.address);

  // 1. deploy SushiToken
  const SushiToken = await ethers.getContractFactory("SushiToken");
  const sushiToken = await SushiToken.deploy();
  await sushiToken.deployed();
  console.log("SushiToken Address: ", sushiToken.address);
  await writeAddr(sushiToken.address, "SushiToken", network.name);

  // 2. deploy MasterChef
  const MasterChef = await ethers.getContractFactory("MasterChef");
  const masterChef = await MasterChef.deploy(
    sushiToken.address,
    owner.address,
    ethers.utils.parseEther("100"),
    0,
    50
  );
  await masterChef.deployed();
  console.log("MasterChef Address: ", masterChef.address);
  await writeAddr(masterChef.address, "MasterChef", network.name);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });