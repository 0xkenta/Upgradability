pragma solidity 0.8.9;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract Test3 is Initializable {
    string public name;
    uint256 public number;
    string public country;

    event NameUpdated(string previsouName, string newName);
    event NumberUpdated(uint256 previousNumber, uint256 newNumber);
    event CountryUpdated(string previousCountry, string newCountry);

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
        return number + 100;
    }

    function updateCountry(string calldata _newCountry) external {
        string memory previousCountry = country;
        country = _newCountry;

        emit CountryUpdated(previousCountry, _newCountry);
    }
}