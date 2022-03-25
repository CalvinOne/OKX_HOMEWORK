const hre = require("hardhat");

const main = async () => {
  // Get signers
  const [owner] = await ethers.getSigners();
  console.log("Owner address:", owner.address);
 
  const provider = new ethers.getDefaultProvider('goerli');
  const abi = [
    "function balanceOf(address account) external view returns (uint256)",
    "function transfer(address to, uint256 amount) external returns (bool)"
  ];
  
  // Connect contract
  const contractAddress = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
  const tokenContract = new ethers.Contract(contractAddress, abi, provider);

  
  // Transfer
  const tokenContractWithSigner = tokenContract.connect(owner);

  const receiver = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
  const DECIMAL_UNITS = 18;
  const tx1 = await tokenContractWithSigner.transfer(receiver, ethers.utils.parseUnits("10000", DECIMAL_UNITS))
  await tx1.wait();

  console.log("Transfer succeed!");
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


// npx hardhat run scripts/call.js --network georli