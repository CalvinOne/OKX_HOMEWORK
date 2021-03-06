
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract USDT is ERC20("USDT", "USDT") ,Ownable{
    constructor() {
        _mint(msg.sender, 10000000 * 10**18);
    }
}