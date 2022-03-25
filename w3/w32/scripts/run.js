// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Get signers
  const [owner, user1] = await ethers.getSigners();
  console.log("Owner address:", owner.address);

  // Deploy contract
  const nftContractFactory = await hre.ethers.getContractFactory('SuperPunk');
  const nftContract = await nftContractFactory.deploy();
  await nftContract.deployed();
  console.log("Contract deployed to:", nftContract.address);

  // mint
  let tx1 = await nftContract.safeMint()
  await tx1.wait()
  console.log("Mint succeed!")

  // check owner balance
  let ownerBalance = await nftContract.balanceOf(owner.address)
  console.log("Owner NFT balance: ", ownerBalance.toNumber())

  // approve and transfer No.1 NFT
  let tx2 = await nftContract.approve(user1.address, 1)
  await tx2.wait()
  console.log("Approve succeed!")

  let tx3 = await nftContract.transferFrom(owner.address, user1.address, 1)
  await tx3.wait()

  // check balance
  ownerBalance = await nftContract.balanceOf(owner.address)
  console.log("Owner NFT balance: ", ownerBalance.toNumber())

  let user1Balance = await nftContract.balanceOf(user1.address)
  console.log("User1 NFT balance: ", user1Balance.toNumber())
  console.log("No.1 NFT owner: ", await nftContract.ownerOf(1))

  // get logs
  let filter = nftContract.filters.Transfer()
  let logs = await nftContract.queryFilter(filter);
  console.log(JSON.stringify(logs, null, 2))

  // got 6 logs (mint 5 + transfer 1)
  console.log("Num of logs: ", logs.length)
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