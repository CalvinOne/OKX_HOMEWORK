// SPDX-License-Identifier: GPL-3.0
pragma solidity  0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BabySiuCoin is ERC20, Ownable {
    constructor() ERC20("BabySiu", "BBS") {
        _mint(msg.sender, 0 * 18 ** decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}