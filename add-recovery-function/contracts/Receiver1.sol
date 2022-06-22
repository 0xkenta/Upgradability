// SPDX-License-Identifier: MIT

pragma solidity 0.8.11;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/utils/ERC721HolderUpgradeable.sol";


contract Receiver1 is Initializable, OwnableUpgradeable, ERC721HolderUpgradeable {
    string public version;

    function initialize(string calldata _version) external initializer {
        version = _version;
        __Ownable_init();
        __ERC721Holder_init();
    }
}
