const hre = require("hardhat");

async function main() {
  // Get signers
  const [owner, user1] = await ethers.getSigners();
  console.log("Owner address:", owner.address);

  // Deploy BabySiuCoin.sol
  const BabySiuCoin = await hre.ethers.getContractFactory("BabySiuCoin");
  const BabySiuCoinContract = await BabySiuCoin.deploy();
  await BabySiuCoinContract.deployed();
  console.log("BabySiuCoin deployed to:", BabySiuCoinContract.address);

  // decimal units
  const DECIMAL_UNITS = 18

  // first mint 10000 tokens and then mint 20000 tokens
  await BabySiuCoinContract.mint(10000);
  const supply1 = await BabySiuCoinContract.totalSupply()
  console.log("Supply1: ", ethers.utils.formatUnits(supply1, DECIMAL_UNITS));
  await BabySiuCoinContract.mint(20000);
  const supply2 = await BabySiuCoinContract.totalSupply()
  console.log("Supply2: ", ethers.utils.formatUnits(supply2, DECIMAL_UNITS));

  // check owner balance
  let ownerBalance = await BabySiuCoinContract.balanceOf(owner.address)
  console.log("Owner balance: ", ethers.utils.formatUnits(ownerBalance, DECIMAL_UNITS));

  // transfer 5000 to user1
  await BabySiuCoinContract.transfer(user1.address, ethers.utils.parseUnits("5000", DECIMAL_UNITS))
  ownerBalance = await BabySiuCoinContract.balanceOf(owner.address)
  console.log("Owner balance: ", ethers.utils.formatUnits(ownerBalance, DECIMAL_UNITS));

  let user1Balance = await BabySiuCoinContract.balanceOf(user1.address)
  console.log("User1 balance: ", ethers.utils.formatUnits(user1Balance, DECIMAL_UNITS));

  // -----------------------------------------

  // Deploy Vault.sol
  const Vault = await hre.ethers.getContractFactory("Vault");
  const vaultContract = await Vault.deploy(BabySiuCoinContract.address);
  await vaultContract.deployed();
  console.log("Vault deployed to:", vaultContract.address);

  // 1. approve vault contract 10000
  // 2. owner deposit 10000 tokens to vault
  // 3. owner check his account at vault
  // 4. owner withdraw 10000 tokens
  await BabySiuCoinContract.approve(vaultContract.address, ethers.utils.parseUnits("10000", DECIMAL_UNITS));
  await vaultContract.deposit(10000)
  let ownerVaultBalance = await vaultContract.showUserBalance()
  console.log("Owner vault balance: ", ethers.utils.formatUnits(ownerVaultBalance, DECIMAL_UNITS));
  ownerBalance = await BabySiuCoinContract.balanceOf(owner.address)
  console.log("Owner balance: ", ethers.utils.formatUnits(ownerBalance, DECIMAL_UNITS));
  
  await vaultContract.withdraw(10000)
  ownerVaultBalance = await vaultContract.showUserBalance()
  console.log("Owner vault balance: ", ethers.utils.formatUnits(ownerVaultBalance, DECIMAL_UNITS));
  ownerBalance = await BabySiuCoinContract.balanceOf(owner.address)
  console.log("Owner balance: ", ethers.utils.formatUnits(ownerBalance, DECIMAL_UNITS));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// npx hardhat run scripts/run.js