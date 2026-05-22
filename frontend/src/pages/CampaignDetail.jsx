/**
 * CampaignDetail.jsx - UPDATED
 *
 * Replace your current frontend/src/pages/CampaignDetail.jsx with this
 *
 * FEATURES:
 * - Loads campaign by address from URL param
 * - Shows campaign details, image, story
 * - Donation form
 * - Donor list with timestamps
 * - Real-time progress updates
 */

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";
import { useWeb3 } from "../context/Web3Context";
import { useContract } from "../hooks/useContract";
import {
  getCampaignDetail,
  getCampaignDonations,
} from "../services/campaignService";
import DonationForm from "../components/DonationForm";
import { formatEthersError } from "../utils/formatEthersError";

export default function CampaignDetail() {
  const { address } = useParams();
  const { provider, readProvider, account } = useWeb3();
  const { getCampaignContract } = useContract();
  const [campaign, setCampaign] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [donating, setDonating] = useState(false);

  // Load campaign data on mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError("");
      try {
        if (readProvider && address) {
          const campaignData = await getCampaignDetail(address, readProvider);
          if (campaignData) {
            setCampaign(campaignData);
            const donationsList = await getCampaignDonations(
              address,
              readProvider,
            );
            setDonations(donationsList);
          } else {
            setError("Campaign not found. Invalid address?");
          }
        }
      } catch (err) {
        console.error("Error loading campaign:", err);
        setError("Failed to load campaign.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [readProvider, address]);

  const handleDonate = async (amountMatic) => {
    if (!account || !provider || !campaign) {
      setError("Connect wallet first.");
      return;
    }

    setDonating(true);
    setError("");
    try {
      const signer = await provider.getSigner();
      const contract = getCampaignContract(address);
      if (!contract) throw new Error("Contract not initialized");

      const connectedContract = contract.connect(signer);
      const tx = await connectedContract.donate({
        value: ethers.parseEther(amountMatic),
      });

      await tx.wait();

      // Reload campaign to show new amount
      const updated = await getCampaignDetail(address, readProvider);
      setCampaign(updated);

      // Reload donations
      const newDonations = await getCampaignDonations(address, readProvider);
      setDonations(newDonations);

      alert(`Donated ${amountMatic} MATIC successfully!`);
    } catch (err) {
      console.error("Donation failed:", err);
      setError(formatEthersError(err));
    } finally {
      setDonating(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="text-center py-12">
          <p className="text-text-secondary">Loading campaign...</p>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="rounded-lg border border-red-500/40 bg-red-950/40 p-6 text-red-200">
          {error || "Campaign not found."}
        </div>
      </div>
    );
  }

  const progressPercent = (campaign.received / campaign.required) * 100;

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8">
      {error && (
        <div className="mb-6 rounded-lg border border-red-500/40 bg-red-950/40 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Campaign Image + Details */}
        <div className="lg:col-span-2">
          {/* Image */}
          <div className="rounded-xl overflow-hidden border border-dark-border mb-6 h-96">
            <img
              src={campaign.image}
              alt={campaign.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Progress Bar */}
          <div className="mb-8 rounded-xl border border-dark-border bg-dark-card p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-semibold tracking-[0.15em] uppercase text-text-muted">
                Progress
              </span>
              <span className="text-2xl font-orbitron font-bold text-accent-green">
                {Math.min(progressPercent, 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-dark-secondary rounded-full h-3">
              <div
                className="bg-accent-green h-3 rounded-full transition-all"
                style={{ width: `${Math.min(progressPercent, 100)}%` }}
              />
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-text-muted font-mono mb-1">RAISED</p>
                <p className="text-2xl font-mono font-bold text-accent-green">
                  {campaign.received.toFixed(2)}
                </p>
                <p className="text-xs text-text-muted mt-1">MATIC</p>
              </div>
              <div>
                <p className="text-xs text-text-muted font-mono mb-1">GOAL</p>
                <p className="text-2xl font-mono font-bold text-text-primary">
                  {campaign.required.toFixed(2)}
                </p>
                <p className="text-xs text-text-muted mt-1">MATIC</p>
              </div>
            </div>
          </div>

          {/* Story / Description */}
          {campaign.description && (
            <div className="rounded-xl border border-dark-border bg-dark-card p-6 mb-8">
              <h2 className="text-xl font-orbitron font-bold text-text-primary mb-4">
                Mission Objective
              </h2>
              <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">
                {campaign.description}
              </p>
            </div>
          )}

          {/* Donor List */}
          {donations.length > 0 && (
            <div className="rounded-xl border border-dark-border bg-dark-card p-6">
              <h2 className="text-xl font-orbitron font-bold text-text-primary mb-4">
                Recent Donations
              </h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {donations.map((donation, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-start p-3 rounded border border-dark-border bg-dark-primary/50"
                  >
                    <div>
                      <p className="font-mono text-sm text-text-muted">
                        {donation.donor.slice(0, 8)}...
                        {donation.donor.slice(-6)}
                      </p>
                      <p className="text-xs text-text-muted mt-1">
                        {donation.timestamp.toLocaleDateString()}{" "}
                        {donation.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    <p className="font-mono font-bold text-accent-green">
                      +{parseFloat(donation.amount).toFixed(4)} MATIC
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Donation Form */}
        <div className="lg:col-span-1">
          <DonationForm
            campaign={campaign}
            onDonate={handleDonate}
            loading={donating}
            isOwner={account?.toLowerCase() === campaign.owner.toLowerCase()}
          />
        </div>
      </div>
    </div>
  );
}
