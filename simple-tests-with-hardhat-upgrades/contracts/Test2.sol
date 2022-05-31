pragma solidity 0.8.9;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract Test2 is Initializable {
    string public name;
    uint256 public number;

    event NameUpdated(string previsouName, string newName);
    event NumberUpdated(uint256 previousNumber, uint256 newNumber);

    function updateName(string calldata _newName) external {
        string memory previousName = name;
        name = _newName;

        emit NameUpdated(previousName, _newName);
    }

    function getName() external view returns (string memory) {
        return name;
    }

    function updateNumber(uint256 _newNumber) external {
        uint256 previousNumber = number;
        number = _newNumber;

        emit NumberUpdated(previousNumber, _newNumber);
    }

    function getNumber() external view returns (uint256) {
        return number;
    }
}