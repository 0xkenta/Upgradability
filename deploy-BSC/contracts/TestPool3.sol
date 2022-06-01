pragma solidity 0.8.9; 

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/utils/ERC721HolderUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";

// @title NFT staking Pool 
contract TestPool3 is Initializable, OwnableUpgradeable, ReentrancyGuardUpgradeable, ERC721HolderUpgradeable {
    /// @notice the information of each staked Token
    /// staker the address of the token staker
    /// power the amount of power that the token possesses
    /// rewardDebt the amount of the accumulated reward tokens at the moment of staking
    /// isStaked true if token deposited in the contract
    struct NFTInfo {
        address staker;
        bool isStaked;
    }

    // tokenId => NFTInfo
    mapping(uint256 => NFTInfo) public nftInfos;
    // staker address => NFT IDs staked by this staker
    mapping(address => uint256[]) public nftIdsStaked;

    // nft contract
    ERC721BurnableUpgradeable public nft;

    uint256 public totalStaked;

    event Deposit(address indexed user, uint256 indexed tokenId);

    /// @notice initialize this contract
    /// @param _nft the address of the NFT contract
    function initialize(address _nft) external initializer {
        require(_nft != address(0), "EMPTY ADDRESS");
        nft = ERC721BurnableUpgradeable(_nft);
        
        __Ownable_init();
        __ReentrancyGuard_init();
        __ERC721Holder_init();
    }

    /// @notice the user can deposit his NFTs
    /// @notice _tokenIds that the user want to stake
    function deposit(uint256[] calldata _tokenIds) external nonReentrant {
        for (uint256 i; i < _tokenIds.length; ) {
            _deposit(_tokenIds[i]);
            unchecked {
                ++i;
            }
        }
    }

    /// @notice internal deposit function
    /// @param _tokenId that the user want to deposit
    function _deposit(uint256 _tokenId) internal {
        require(
            nft.isApprovedForAll(msg.sender, address(this)) ||
                nft.getApproved(_tokenId) == address(this),
            'NO TRANSFER APPROVED'
        );

        nft.safeTransferFrom(msg.sender, address(this), _tokenId);

        NFTInfo storage nftInfo = nftInfos[_tokenId];

        nftInfo.staker = msg.sender;
        nftInfo.isStaked = true;

        nftIdsStaked[msg.sender].push(_tokenId);

        ++totalStaked;

        emit Deposit(msg.sender, _tokenId);
    }

    /// @notice burn staked tokens
    /// @param _tokenIds that the staker want to burn
    function burn(uint256[] calldata _tokenIds) external nonReentrant {
        for (uint256 i; i < _tokenIds.length; ) {
            _burn(_tokenIds[i]);

            unchecked {
                ++i;
            }
        }
    }

    /// @notice internal burn function
    /// @param _tokenId that the staker want to burn
    function _burn(uint256 _tokenId) internal {
        require(removeTokenId(_tokenId), 'NO STAKED TOKEN');

        delete nftInfos[_tokenId];

        --totalStaked;

        nft.burn(_tokenId);
    }
    
    /// @notice return the staked token length of the user
    /// @param _staker the address of the user
    /// @return the length of the staked token 
    function getStakingTokenLength(address _staker) external view returns (uint256) {
        return nftIdsStaked[_staker].length;
    } 

    /// @notice try to delete a special tokenId from nftIdsStaked of msg.sender
    /// @param _tokenId The ID of the staked token
    /// @return true if delete tokenId from nftIdsStaked else false
    function removeTokenId(uint256 _tokenId) internal returns (bool) {
        uint256[] storage tokenIds = nftIdsStaked[msg.sender];
        uint256 idsLength = tokenIds.length;

        for (uint256 index; index < idsLength; ) {
            if (tokenIds[index] == _tokenId) {
                tokenIds[index] = tokenIds[idsLength - 1];
                tokenIds.pop();

                return true;
            }
            unchecked {
                ++index;
            }
        }
        return false;
    }
}