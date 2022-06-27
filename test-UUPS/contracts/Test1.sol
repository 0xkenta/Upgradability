// SPDX-License-Identifier: MIT

pragma solidity 0.8.11;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";


contract Test1 is Initializable, OwnableUpgradeable, UUPSUpgradeable {
    uint256 public number;

    function initialize(uint256 _number) external initializer {
        number = _number;
        
        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    function setNumber(uint256 _newNumber) external onlyOwner {
        number = _newNumber;
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}
}
