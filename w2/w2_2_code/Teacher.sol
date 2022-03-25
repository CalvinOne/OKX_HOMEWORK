// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "https://github.com/CalvinOne/SolidityLearn/blob/main/w2_2_code/Score.sol";
import "https://github.com/CalvinOne/SolidityLearn/blob/main/w2_2_code/IScore.sol";

contract Teacher {

    address public scoreAddress;

    function createNewScoreContract() public {
        Score score = new Score();
        scoreAddress = address(score);
    }

    function setScore(address _student, uint _score) external {
        IScore(scoreAddress).setScore(_student, _score);
    }
    
    function getScore(address _student) external view returns (uint) {
        return IScore(scoreAddress).getScore(_student);
    }

}
