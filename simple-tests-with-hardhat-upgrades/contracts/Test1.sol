pragma solidity 0.8.9;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract Test1 is Initializable {
    string public name;
    uint256 public number;

    event NameUpdated(string previsouName, string newName);
    event NumberUpdated(uint256 previousNumber, uint256 newNumber);

    function initialize(string calldata _newName, uint256 _newNumber) external initializer {
        name = _newName;
        number = _newNumber;

        emit NameUpdated("", _newName);
        emit NumberUpdated(0, _newNumber);
    }

    function updateName(string calldata _newName) external {
        string memory previousName = name;
        name = _newName;

        emit NameUpdated(previousName, _newName);
    }

    function getName() external view returns (string memory) {
        return name;
    }
}