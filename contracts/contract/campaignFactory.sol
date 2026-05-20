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

    event CampaignDeleted(
        address indexed campaignAddress,
        address indexed owner
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

    function deleteCampaign(address _campaign) public {
        Campaign campaign = Campaign(_campaign);
        require(campaign.owner() == msg.sender, "Only campaign owner can delete");
        require(
            campaign.receivedAmount() == 0,
            "Cannot delete campaign with donations"
        );

        uint256 length = deployedCampaigns.length;
        for (uint256 i = 0; i < length; i++) {
            if (deployedCampaigns[i] == _campaign) {
                deployedCampaigns[i] = deployedCampaigns[length - 1];
                deployedCampaigns.pop();
                emit CampaignDeleted(_campaign, msg.sender);
                return;
            }
        }
        revert("Campaign not found");
    }
}
