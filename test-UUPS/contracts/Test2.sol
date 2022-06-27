// SPDX-License-Identifier: MIT

pragma solidity 0.8.11;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";


contract Test2 is Initializable, OwnableUpgradeable, UUPSUpgradeable {
    uint256 public number;
    uint public secondNumber;

    function initialize(uint256 _number, uint256 _secondNumber) external initializer {
        number = _number;
        secondNumber = _secondNumber;
        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    function setNumber(uint256 _newNumber) external onlyOwner {
        number = _newNumber;
    }

    function setSecondNumber(uint256 _newSecondNumber) external onlyOwner {
        secondNumber = _newSecondNumber;
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}
}