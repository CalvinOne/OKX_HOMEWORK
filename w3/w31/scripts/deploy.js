const hre = require("hardhat");

async function main() {
  // Get signers
  const [owner] = await ethers.getSigners();
  console.log("Owner address:", owner.address);

  // Deploy BabySiuCoin.sol
  const BabySiuCoin = await hre.ethers.getContractFactory("BabySiuCoin");
  const BabySiuCoinContract = await BabySiuCoin.deploy();
  await BabySiuCoinContract.deployed();
  console.log("BabySiuCoin deployed to:", BabySiuCoinContract.address);

  // Deploy Vault.sol
  const Vault = await hre.ethers.getContractFactory("Vault");
  const vaultContract = await Vault.deploy(BabySiuCoinContract.address);
  await vaultContract.deployed();
  console.log("Vault deployed to:", vaultContract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// npx hardhat run scripts/deploy.js --network goerli