// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract owned {

    constructor() { owner = payable(msg.sender); }

    address owner;

    // 这意味着如果是 owner 调用这个函数，则函数会被执行，否则会抛出异常。
    modifier onlyOwner {
        require(
            msg.sender == owner,
            "Only owner can call this function."
        );
        _;
    }
}

contract Bank is owned {

    // 转账记录
    mapping(address => uint256) public trasferOfEth;

    // 接受ETH
    receive() external payable {
        if (trasferOfEth[msg.sender] > 0) {
            trasferOfEth[msg.sender] += msg.value;
        }else {
            trasferOfEth[msg.sender] = msg.value;
        }
    }
 
    fallback() external {}

    // 提取合约中的ETH
    function withdraw(address payable _to) external onlyOwner {
        require(owner == _to, "Only Twist can withdraw!");
        _to.transfer(address(this).balance);
    }  
}