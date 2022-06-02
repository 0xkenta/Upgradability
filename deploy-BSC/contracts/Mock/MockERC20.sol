pragma solidity 0.8.2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MockERC20 is ERC20, Ownable {
    constructor() ERC20("Test", "TEST") {}

    function mint(address _recipient, uint256 _amount) external {
        _mint(_recipient, _amount);
    }
}
