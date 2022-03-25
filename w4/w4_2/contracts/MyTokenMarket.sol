//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import './IUniswapV2Factory.sol';
import './IUniswapV2Pair.sol';
import './IUniswapV2Router01.sol';
import './IMasterChef.sol';

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';

contract MyTokenMarket {
    using SafeERC20 for IERC20;

    address public myToken;
    address public router;
    address public weth;
    address public masterChef;
    address public factory;

    constructor(
        address _token,
        address _router,
        address _weth,
        address _masterChef,
        address _factory
    ) {
        myToken = _token;
        router = _router;
        weth = _weth;
        masterChef = _masterChef;
        factory = _factory;
    }

    function addLiquidity(uint256 tokenAmount) public payable {
        IERC20(myToken).safeTransferFrom(msg.sender, address(this), tokenAmount);
        IERC20(myToken).safeApprove(router, tokenAmount);

        // ingnore slippage
        IUniswapV2Router01(router).addLiquidityETH{value: msg.value}(
            myToken,
            tokenAmount,
            0,
            0,
            msg.sender,
            block.timestamp
        );
    }

    function buyToken() public payable {
        address[] memory path = new address[](2);
        path[0] = weth;
        path[1] = myToken;

        uint256[] memory amounts = IUniswapV2Router01(router).swapExactETHForTokens{value: msg.value}(
            0,
            path,
            address(this),
            block.timestamp
        );

        IERC20(myToken).safeApprove(masterChef, ~uint256(0));
        IMasterChef(masterChef).deposit(0, amounts[1]);
    }

    function withdraw(uint256 _amount) public {
        require(_amount > 0, 'Market: withdraw amount must be greater than 0');
        IMasterChef(masterChef).withdraw(0, _amount);

        IERC20(myToken).safeApprove(address(this), _amount);
        IERC20(myToken).safeTransferFrom(address(this), msg.sender, _amount);
    }
}