pragma solidity 0.8.11;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFT is ERC721 {

    uint256 public tokenCounter;
    mapping (uint256 => string) private _tokenURIs;

    constructor(
        string memory name,
        string memory symbol
    ) ERC721(name, symbol) {
        tokenCounter = 1;
    }

    function mint() external {
        uint256 tokenId = tokenCounter;

        _safeMint(msg.sender, tokenId);
        
        ++tokenCounter;
    }
}