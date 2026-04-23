//
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Campaign {
    string public title;
    uint public requiredAmount;
    string public imageURI;
    string public storyURI;
    address public owner;
    uint public receivedAmount;

    struct Donation {
        address donor;
        uint amount;
        uint timestamp;
    }

    Donation[] public donations;

    event Donated(address indexed donor, uint amount, uint timestamp);

    constructor(
        string memory _title,
        uint _requiredAmount,
        string memory _imageURI,
        string memory _storyURI,
        address _owner
    ) {
        title = _title;
        requiredAmount = _requiredAmount;
        imageURI = _imageURI;
        storyURI = _storyURI;
        owner = _owner;
    }

    function donate() public payable {
        require(msg.value > 0, "Donation must be greater than 0");
        require(receivedAmount < requiredAmount, "Goal already reached");

        receivedAmount += msg.value;
        donations.push(Donation(msg.sender, msg.value, block.timestamp));

        emit Donated(msg.sender, msg.value, block.timestamp);
    }

    function getDonations() public view returns (Donation[] memory) {
        return donations;
    }

    function withdrawFunds() public {
        require(msg.sender == owner, "Only owner can withdraw");
        require(receivedAmount > 0, "No funds to withdraw");

        uint amount = receivedAmount;
        receivedAmount = 0;

        (bool success, ) = payable(owner).call{value: amount}("");
        require(success, "Transfer failed");
    }
}
