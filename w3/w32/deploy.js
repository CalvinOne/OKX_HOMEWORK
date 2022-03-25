const hre = require("hardhat");

async function main() {
  // Get signers
  const [owner] = await ethers.getSigners();
  console.log("Owner address:", owner.address);

  // Deploy contract
  const nftContractFactory = await hre.ethers.getContractFactory('SuperPunk');
  const nftContract = await nftContractFactory.deploy();
  await nftContract.deployed();
  console.log("Contract deployed to:", nftContract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// npx hardhat run scripts/deploy.js --network georli