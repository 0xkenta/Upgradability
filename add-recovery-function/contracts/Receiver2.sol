// SPDX-License-Identifier: MIT

pragma solidity 0.8.11;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/utils/ERC721HolderUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";


contract Receiver2 is Initializable, OwnableUpgradeable, ERC721HolderUpgradeable {
    using SafeERC20Upgradeable for IERC20Upgradeable;

    string public version;

    function initialize(string calldata _version) external initializer {
        version = _version;
        __Ownable_init();
        __ERC721Holder_init();
    }

    function recoverERC20(address _tokenAddress, address _recipient) external onlyOwner {
        require(_tokenAddress != address(0), "EMPTY TOKEN ADDRESS");
        require(_recipient != address(0), "EMPTY RECIPIENT ADDRESS");

        uint256 _amount = IERC20Upgradeable(_tokenAddress).balanceOf(address(this));

        IERC20Upgradeable(_tokenAddress).safeTransfer(_recipient, _amount);
    }

    function recoverERC721(address _tokenAddress, address _recipient, uint256 _tokenId) external onlyOwner {
        require(_tokenAddress != address(0), "EMPTY TOKEN ADDRESS");
        require(_recipient != address(0), "EMPTY RECIPIENT ADDRESS");

        IERC721(_tokenAddress).safeTransferFrom(address(this), _recipient, _tokenId);
    }

    function updateVersion(string calldata _newVersion) external onlyOwner {
        version = _newVersion;
    }
}