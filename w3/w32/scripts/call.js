const hre = require("hardhat");

const main = async () => {
  // Get signers
  const [owner] = await ethers.getSigners();
  console.log("Owner address:", owner.address);
 
  const provider = new ethers.getDefaultProvider('goerli');
  const abi = [
    "function safeMint() public",
    "function approve(address to, uint256 tokenId) external",
    "function ownerOf(uint256 tokenId) external view returns (address owner)",
    "function balanceOf(address owner) external view returns (uint256 balance)",
    "function safeTransferFrom(address from, address to, uint256 tokenId) external",
  ];
  
  // Connect contract
  const contractAddress = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
  const nftContract = new ethers.Contract(contractAddress, abi, provider);
  const nftContractWithSigner = nftContract.connect(owner);

  // mint
  let tx1 = await nftContractWithSigner.safeMint()
  await tx1.wait()
  console.log("Mint succeed!")

  const receiver = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";

  // check owner balance
  let ownerBalance = await nftContractWithSigner.balanceOf(owner.address)
  console.log("Owner NFT balance: ", ownerBalance.toNumber())

  // approve and transfer No.1 NFT
  let tx2 = await nftContractWithSigner.approve(receiver, 1)
  await tx2.wait()
  console.log("Approve succeed!")

  let tx3 = await nftContractWithSigner.safeTransferFrom(owner.address, receiver, 1)
  await tx3.wait()

  // check balance
  ownerBalance = await nftContractWithSigner.balanceOf(owner.address)
  console.log("Owner NFT balance: ", ownerBalance.toNumber())

  let user1Balance = await nftContractWithSigner.balanceOf(receiver)
  console.log("User1 NFT balance: ", user1Balance.toNumber())
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


// npx hardhat run scripts/call.js --network georli