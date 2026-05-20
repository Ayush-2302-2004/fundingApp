/**
 * Dashboard.jsx - UPDATED
 *
 * Replace your current frontend/src/pages/Dashboard.jsx with this
 *
 * FEATURES:
 * - Shows campaigns owned by connected wallet
 * - Campaign stats
 * - Quick actions (withdraw funds, etc)
 */

import { useState, useEffect } from "react";
import { useWeb3 } from "../context/Web3Context";
import { useContract } from "../hooks/useContract";
import { getCampaigns } from "../services/campaignService";
import Card from "../components/Card";

export default function Dashboard() {
  const { account, readProvider } = useWeb3();
  const { factoryContract } = useContract();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUserCampaigns = async () => {
      setLoading(true);
      setError("");
      try {
        if (!account) {
          setError("Connect wallet to view dashboard");
          setLoading(false);
          return;
        }

        if (factoryContract && readProvider) {
          const allCampaigns = await getCampaigns(factoryContract, readProvider);

          // Filter campaigns owned by user
          const userCampaigns = allCampaigns.filter(
            (c) => c.owner.toLowerCase() === account.toLowerCase(),
          );

          setCampaigns(userCampaigns);
        }
      } catch (err) {
        console.error("Error loading dashboard:", err);
        setError("Failed to load campaigns");
      } finally {
        setLoading(false);
      }
    };

    loadUserCampaigns();
  }, [factoryContract, readProvider, account]);

  // Calculate user stats
  const handleCampaignDeleted = (address) => {
    setCampaigns((prev) => prev.filter((c) => c.address !== address));
  };

  const userStats = {
    totalCampaigns: campaigns.length,
    totalRaised: campaigns.reduce((sum, c) => sum + c.received, 0),
    activeCampaigns: campaigns.filter((c) => c.received < c.required).length,
  };

  if (!account) {
    return (
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <h1 className="text-4xl font-orbitron text-text-primary mb-4">
          Dashboard
        </h1>
        <div className="rounded-lg border border-yellow-500/40 bg-yellow-950/40 p-6 text-yellow-200">
          Connect your wallet to view your campaigns
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-orbitron text-text-primary mb-2">
          Dashboard
        </h1>
        <p className="text-text-secondary">
          Wallet: {account.slice(0, 8)}...{account.slice(-6)}
        </p>
      </header>

      {error && (
        <div className="mb-6 rounded-lg border border-red-500/40 bg-red-950/40 p-4 text-red-200">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="rounded-xl border border-dark-border bg-dark-card p-6">
          <p className="text-xs tracking-[0.14em] text-text-muted uppercase font-semibold mb-3">
            Total Campaigns
          </p>
          <p className="text-4xl font-orbitron font-bold text-text-primary">
            {userStats.totalCampaigns}
          </p>
        </div>

        <div className="rounded-xl border border-dark-border bg-dark-card p-6">
          <p className="text-xs tracking-[0.14em] text-text-muted uppercase font-semibold mb-3">
            Total Raised
          </p>
          <p className="text-4xl font-orbitron font-bold text-accent-green">
            {userStats.totalRaised.toFixed(2)}
          </p>
          <p className="text-xs text-text-muted mt-1">MATIC</p>
        </div>

        <div className="rounded-xl border border-dark-border bg-dark-card p-6">
          <p className="text-xs tracking-[0.14em] text-text-muted uppercase font-semibold mb-3">
            Active
          </p>
          <p className="text-4xl font-orbitron font-bold text-yellow-300">
            {userStats.activeCampaigns}
          </p>
        </div>
      </section>

      {/* Campaigns */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-orbitron text-text-primary">
            Your Campaigns
          </h2>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-text-secondary">Loading your campaigns...</p>
          </div>
        ) : campaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <Card
                key={campaign.address}
                campaign={campaign}
                onDeleted={handleCampaignDeleted}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dark-border bg-dark-card/50 p-12 text-center">
            <p className="text-text-secondary mb-4">No campaigns yet</p>
            <a
              href="/create"
              className="inline-block rounded-lg bg-accent-green px-8 py-3 font-orbitron text-sm font-bold text-dark-primary hover:bg-[#8dff7d]"
            >
              Create Campaign
            </a>
          </div>
        )}
      </section>
    </div>
  );
}
