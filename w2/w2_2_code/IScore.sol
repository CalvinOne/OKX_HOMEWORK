// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

interface IScore {
    function setScore(address _student, uint _score) external;

    function getScore(address _student) external view returns (uint);

}