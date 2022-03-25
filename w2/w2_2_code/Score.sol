// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Score {

    address public teacher;
    mapping(address => uint) public scoreMap;

    constructor() {
        teacher = msg.sender;
    }

    modifier onlyTeacher() {
        require(msg.sender == teacher, "Not teacher!");
        _;
    }

    modifier validScore(uint _score) {
        require(_score <= 100, "Invalid score!");
        _;
    }

    function setScore(address _student, uint _score) onlyTeacher validScore(_score) external {
        scoreMap[_student] = _score;
    }

    function getScore(address _student) external view returns (uint) {
        return scoreMap[_student];
    }
    
}