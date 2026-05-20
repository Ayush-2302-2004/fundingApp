/**
 * campaignService.js
 *
 * Core service for fetching campaigns from blockchain.
 * Place in: frontend/src/services/campaignService.js
 *
 * Usage:
 * const campaigns = await getCampaigns(factoryContract, provider);
 * const campaign = await getCampaignDetail(campaignAddress, provider);
 */

import { ethers } from "ethers";

/**
 * Fetch all campaigns from factory contract
 * Returns array of campaign objects ready for UI
 */
export async function getCampaigns(factoryContract, provider) {
  if (!factoryContract || !provider) return [];

  try {
    // Get all deployed campaign addresses from factory
    const campaignAddresses = await factoryContract.getDeployedCampaigns();

    if (campaignAddresses.length === 0) return [];

    // Fetch each campaign's data in parallel
    const campaigns = await Promise.all(
      campaignAddresses.map((address) => getCampaignDetail(address, provider)),
    );

    // Filter out any failed fetches
    return campaigns.filter(Boolean);
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return [];
  }
}

/**
 * Fetch single campaign details
 * Reads from both Campaign contract and uses IPFS for image
 */
export async function getCampaignDetail(campaignAddress, provider) {
  if (!provider) return null;

  try {
    // Minimal ABI - only what we need to read data
    const CAMPAIGN_ABI = [
      "function title() public view returns (string)",
      "function requiredAmount() public view returns (uint)",
      "function imageURI() public view returns (string)",
      "function storyURI() public view returns (string)",
      "function owner() public view returns (address)",
      "function receivedAmount() public view returns (uint)",
      "function donations() public view returns (tuple(address donor, uint amount, uint timestamp)[])",
      "function getDonations() public view returns (tuple(address donor, uint amount, uint timestamp)[])",
    ];

    const contract = new ethers.Contract(
      campaignAddress,
      CAMPAIGN_ABI,
      provider,
    );

    // Fetch all data in parallel
    const [title, requiredAmount, imageURI, storyURI, owner, receivedAmount] =
      await Promise.all([
        contract.title(),
        contract.requiredAmount(),
        contract.imageURI(),
        contract.storyURI(),
        contract.owner(),
        contract.receivedAmount(),
      ]);

    // Convert wei to ether
    const requiredEther = ethers.formatEther(requiredAmount);
    const receivedEther = ethers.formatEther(receivedAmount);

    // Build image URL from IPFS CID
    const imageUrl = imageURI
      ? `https://gateway.pinata.cloud/ipfs/${imageURI}`
      : "https://via.placeholder.com/400x300?text=No+Image";

    return {
      address: campaignAddress,
      title,
      description: storyURI, // Story stored as description
      image: imageUrl,
      owner,
      category: "General", // Category not stored in current contract, add if needed
      required: parseFloat(requiredEther),
      received: parseFloat(receivedEther),
      imageURI, // Raw IPFS hash
      storyURI,
    };
  } catch (error) {
    console.error(`Error fetching campaign ${campaignAddress}:`, error);
    return null;
  }
}

/**
 * Get donations for specific campaign
 */
export async function getCampaignDonations(campaignAddress, provider) {
  if (!provider) return [];

  try {
    const CAMPAIGN_ABI = [
      "function getDonations() public view returns (tuple(address donor, uint amount, uint timestamp)[])",
    ];

    const contract = new ethers.Contract(
      campaignAddress,
      CAMPAIGN_ABI,
      provider,
    );

    const donations = await contract.getDonations();

    return donations.map((d) => ({
      donor: d.donor,
      amount: ethers.formatEther(d.amount),
      timestamp: new Date(Number(d.timestamp) * 1000),
    }));
  } catch (error) {
    console.error("Error fetching donations:", error);
    return [];
  }
}

/**
 * Upload image to Pinata (IPFS)
 * Returns CID hash
 *
 * Requires VITE_PINATA_JWT env var
 *
 * Usage:
 * const cid = await uploadToPinata(file);
 */
export async function uploadToPinata(file) {
  const pinatJwt = import.meta.env.VITE_PINATA_JWT;

  if (!pinatJwt) {
    console.warn("VITE_PINATA_JWT not set. Using placeholder.");
    return "QmPlaceholderImageHash";
  }

  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${pinatJwt}`,
        },
        body: formData,
      },
    );

    if (!response.ok) {
      throw new Error(`Pinata error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.IpfsHash; // CID
  } catch (error) {
    console.error("Pinata upload error:", error);
    throw error;
  }
}

/**
 * Delete a campaign from the factory (on-chain). Requires wallet signer.
 * Owner verification is enforced on-chain; frontend also checks before sending.
 */
export async function deleteCampaign(
  factoryContract,
  campaignAddress,
  connectedAccount,
  campaignOwner,
) {
  if (!factoryContract || !connectedAccount) {
    throw new Error("Connect your wallet to delete a campaign.");
  }

  if (
    connectedAccount.toLowerCase() !== campaignOwner?.toLowerCase()
  ) {
    throw new Error("Only the campaign owner can delete this campaign.");
  }

  const tx = await factoryContract.deleteCampaign(campaignAddress);
  await tx.wait();
  return true;
}

/**
 * Calculate campaign stats from array of campaigns
 */
export function calculateStats(campaigns) {
  const totalContributions = campaigns.reduce((sum, c) => sum + c.received, 0);
  const activeCampaigns = campaigns.filter(
    (c) => c.received < c.required,
  ).length;
  const fundsRaised = campaigns.reduce(
    (sum, c) => sum + Math.min(c.received, c.required),
    0,
  );

  return {
    totalContributions: totalContributions.toFixed(2),
    activeCampaigns,
    fundsRaised: fundsRaised.toFixed(2),
  };
}
