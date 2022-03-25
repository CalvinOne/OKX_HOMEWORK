const { ethers } = require("hardhat");

const UniswapV2Factory = require(`../node_modules/@uniswap/v2-core/build/UniswapV2Factory.json`);
const Router = require(`../node_modules/@uniswap/v2-periphery/build/Router.json`);
const WETH = require(`../node_modules/@uniswap/v2-periphery/build/WETH.json`);
const UniswapV2FactoryABI = require(`../node_modules/@uniswap/v2-core/build/UniswapV2Factory.json`);
const MasterChef = require(`../deployments/${network.name}/MasterChef.json`);
const Token = require(`../deployments/${network.name}/Token.json`);
const MyTokenMarket = require(`../deployments/${network.name}/MyTokenMarket.json`);

async function main() {
  const [owner] = await ethers.getSigners();
  console.log("Owner address:", owner.address);

  // 1. get contracts
  const provider = new ethers.getDefaultProvider("https://goerli.infura.io/v3/74944fdceafe4b7799f79fc9db0b6db1");
  const token = await ethers.getContractAt(
    Token.contractName,
    Token.address,
    owner
  );

  const market = await ethers.getContractAt(
    MyTokenMarket.contractName,
    MyTokenMarket.address,
    owner
  );

  let ownerBalance = await token.balanceOf(owner.address);
  console.log(
    "Owner $2321 token balance: ",
    ethers.utils.formatUnits(ownerBalance, 18)
  );

  // 2. approve market
  let tx1 = await token.approve(market.address, ethers.constants.MaxUint256);
  await tx1.wait();

  // 3. add liquidity
  const ethAmount = ethers.utils.parseUnits("10", 18);
  const tokenAmount = ethers.utils.parseUnits("10000", 18);
  let tx2 = await market.addLiquidity(tokenAmount, { value: ethAmount });
  await tx2.wait();
  console.log("Add Liquidity, ETH: 10 and $2321 10000");

  ownerBalance = await token.balanceOf(owner.address);
  console.log(
    "Owner $2331 token balance: ",
    ethers.utils.formatUnits(ownerBalance, 18)
  );

  // 4. check LP tokens
  const factory = new ethers.Contract(
    UniswapV2Factory.address,
    UniswapV2FactoryABI,
    provider
  );

  let pairAddress = await factory.getPair(Token.address, WETH.address);
  console.log("Pair address: ", pairAddress);

  let pairBalance = await token.balanceOf(pairAddress);
  console.log(
    "Pair token balance: ",
    ethers.utils.formatUnits(pairBalance, 18)
  );

  // 5. add token to MasterChef
  let masterChef = await ethers.getContractAt(
    MasterChef.contractName,
    MasterChef.address,
    owner
  );

  await masterChef.add(50, token.address, true);
  let pid = await masterChef.poolLength();
  pid -= 1;
  console.log("LP pid in MasterChef is: ", pid);

  // 6. buy token at market
  let tx3 = await market.buyToken({ value: ethers.utils.parseEther("1") });
  await tx3.wait();

  ownerBalance = await token.balanceOf(owner.address);
  console.log(
    "After buy tokens, owner balance is: ",
    ethers.utils.formatUnits(ownerBalance, 18)
  );

  pairBalance = await token.balanceOf(pairAddress);
  console.log(
    "After buy tokens, pair token balance: ",
    ethers.utils.formatUnits(pairBalance, 18)
  );

  // 7. withdraw
  let tx4 = await market.withdraw(
    ethers.utils.parseUnits("500", 18)
  );
  await tx4.wait();

  ownerBalance = await token.balanceOf(owner.address);
  console.log(
    "After withdraw, owner token balance: ",
    ethers.utils.formatUnits(ownerBalance, 18)
  );

  pairBalance = await token.balanceOf(pairAddress);
  console.log(
    "After withdraw, pair token balance: ",
    ethers.utils.formatUnits(pairBalance, 18)
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });