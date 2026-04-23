// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// 👇 IMPORT Campaign contract
import "./campaign.sol";

contract CampaignFactory {
    address[] public deployedCampaigns;

    event CampaignCreated(
        string indexed title,
        uint requiredAmount,
        address indexed owner,
        address campaignAddress,
        string imageURI,
        uint indexed timestamp,
        string category
    );

    function createCampaign(
        string memory _title,
        uint _requiredAmount,
        string memory _imageURI,
        string memory _category,
        string memory _storyURI
    ) public {
        Campaign newCampaign = new Campaign(
            _title,
            _requiredAmount,
            _imageURI,
            _storyURI,
            msg.sender
        );

        deployedCampaigns.push(address(newCampaign));

        emit CampaignCreated(
            _title,
            _requiredAmount,
            msg.sender,
            address(newCampaign),
            _imageURI,
            block.timestamp,
            _category
        );
    }

    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}
