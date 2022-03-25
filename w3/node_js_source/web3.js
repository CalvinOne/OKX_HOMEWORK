const fs = require("fs");

const solc = require('solc');

let source = "pragma solidity ^0.4.0;contract Calc{  /*区块链存储*/  uint count;  /*执行会写入数据，所以需要`transaction`的方式执行。*/  function add(uint a, uint b) returns(uint){    count++;    return a + b;  }  /*执行不会写入数据，所以允许`call`的方式执行。*/  function getCount() returns (uint){    return count;  }}";

//let calc = web3.eth.compile.solidity(source);