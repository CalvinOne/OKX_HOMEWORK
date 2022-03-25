let { ethers } = require("hardhat");
let { writeAddr } = require('./artifact_log.js');

async function main() {
    // await run('compile');
    let [owner, second] = await ethers.getSigners();

    let Token = await ethers.getContractFactory("Token");
    let aAmount = ethers.utils.parseUnits("100000", 18);
    let atoken = await Token.deploy(
        "AToken",
        "AToken",
        aAmount);

    await atoken.deployed();
    console.log("AToken:" + atoken.address);

    let MyTokenMarket = await ethers.getContractFactory("MyTokenMarket");

    let routerAddr = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
    let wethAddr = "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6";

    let market = await MyTokenMarket.deploy(
        atoken.address,
        routerAddr,
        wethAddr,
    );

    await market.deployed();
    console.log("market:" + market.address);

    await atoken.approve(market.address, ethers.constants.MaxUint256);

    let ethAmount = ethers.utils.parseUnits("0.01", 18);
    await market.AddLiquidity(aAmount, { value: ethAmount,gasLimit: 20000000 })
    console.log("添加流动性");

    let b = await atoken.balanceOf(owner.address);
    console.log("持有token:" + ethers.utils.formatUnits(b, 18));

    let buyEthAmount = ethers.utils.parseUnits("0.08", 18);
    out = await market.buyToken("0", { value: buyEthAmount, gasLimit: 20000000 })

    b = await atoken.balanceOf(owner.address);
    console.log("购买到:" + ethers.utils.formatUnits(b, 18));

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });