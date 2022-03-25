// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract Counter {
    uint private count;

    constructor(uint _count) {
        console.log("Deploying a Counter with number:", _count);
        count = _count;
    }

    // Function to get the current count
    function get() public view returns (uint) {
        return count;
    }

    // Function to set the count value
    function set(uint _count) public {
        console.log("Set counter:", _count);
        count = _count;
    }

    // Function to increment count by 1
    function inc() public {
        count += 1;
        console.log("Counter++ :", count);
    }

    // Function to decrement count by 1
    function dec() public {
        count -= 1;
        console.log("Counter-- :", count);
    }
}