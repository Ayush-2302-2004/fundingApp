/**
 * Home.jsx - UPDATED
 *
 * Replace your current frontend/src/pages/Home.jsx with this
 *
 * NOW FETCHES REAL CAMPAIGNS FROM BLOCKCHAIN
 * - Loads all campaigns on mount
 * - Shows live stats
 * - Links to campaign detail pages
 */

import { useState, useEffect } from "react";
import Card from "../components/Card";
import { useWeb3 } from "../context/Web3Context";
import { useContract } from "../hooks/useContract";
import { getCampaigns, calculateStats } from "../services/campaignService";

const statusClasses = {
  LIVE: "bg-accent-green/20 text-accent-green border border-accent-green/30",
  COMPLETED: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
  PENDING: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
};

export default function Home() {
  const { readProvider } = useWeb3();
  const { factoryContract } = useContract();
  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch campaigns on mount
  useEffect(() => {
    const loadCampaigns = async () => {
      setLoading(true);
      setError("");
      try {
        if (factoryContract && readProvider) {
          const data = await getCampaigns(factoryContract, readProvider);
          setCampaigns(data);

          // Calculate stats
          if (data.length > 0) {
            const calculatedStats = calculateStats(data);
            setStats(calculatedStats);
          }
        }
      } catch (err) {
        console.error("Failed to load campaigns:", err);
        setError("Failed to load campaigns. Check console.");
      } finally {
        setLoading(false);
      }
    };

    loadCampaigns();
  }, [factoryContract, readProvider]);

  const statCards = stats
    ? [
        {
          label: "TOTAL CONTRIBUTIONS",
          value: `${stats.totalContributions} MATIC`,
          accent: "text-text-primary",
        },
        {
          label: "ACTIVE CAMPAIGNS",
          value: String(stats.activeCampaigns).padStart(2, "0"),
          accent: "text-accent-green",
        },
        {
          label: "FUNDS RAISED",
          value: `${stats.fundsRaised} MATIC`,
          accent: "text-text-primary",
        },
      ]
    : [];

  const featuredCampaign = campaigns.length > 0 ? campaigns[0] : null;

  const handleCampaignDeleted = (address) => {
    setCampaigns((prev) => {
      const next = prev.filter((c) => c.address !== address);
      if (next.length > 0) {
        setStats(calculateStats(next));
      } else {
        setStats(null);
      }
      return next;
    });
  };

  return (
    <>
      {/* Full-viewport hero — campaigns sit below the fold */}
      <section
        className="min-h-[calc(100svh-5rem)] flex items-center justify-center px-6 py-12 text-center"
        aria-label="Welcome"
      >
        <h1
          className="max-w-5xl font-orbitron text-3xl sm:text-4xl md:text-5xl lg:text-6xl
                     leading-tight tracking-wide bg-gradient-to-r from-cyan-400 to-emerald-400
                     bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]"
        >
          WELCOME TO THE FUTURE OF BLOCKCHAIN-BASED FUNDRAISING
        </h1>
      </section>

      <div className="max-w-[1200px] mx-auto px-6 pb-8">
        <section className="mb-8">
          <h2 className="text-5xl md:text-6xl font-orbitron leading-tight text-text-primary">
            CAMPAIGNS
          </h2>
        </section>

      {error && (
        <div className="mb-8 rounded-lg border border-red-500/40 bg-red-950/40 px-6 py-4 text-red-200">
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div className="mb-8 rounded-xl border border-dark-border bg-dark-card/70 p-8 text-center">
          <p className="text-text-secondary">
            Loading campaigns from blockchain...
          </p>
        </div>
      ) : featuredCampaign ? (
        <section className="mb-8 rounded-xl border border-dark-border bg-dark-card/70 overflow-hidden">
          <div className="p-4 border-b border-dark-border">
            <p className="font-mono text-xs tracking-[0.16em] uppercase text-accent-green flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent-green status-live" />
              Live Network Feed
            </p>
          </div>
          <div className="p-4">
            <Card
              campaign={featuredCampaign}
              onDeleted={handleCampaignDeleted}
            />
          </div>
        </section>
      ) : (
        <section className="mb-8 rounded-xl border border-dark-border bg-dark-card/70 p-8 text-center">
          <p className="text-text-secondary">
            No campaigns found. Create one to get started!
          </p>
        </section>
      )}

      {statCards.length > 0 && (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {statCards.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-dark-border bg-dark-card p-5 card-hover"
            >
              <p className="text-[11px] tracking-[0.14em] text-text-muted uppercase font-semibold mb-4">
                {item.label}
              </p>
              <p
                className={`text-4xl font-orbitron font-semibold ${item.accent}`}
              >
                {item.value}
              </p>
              <div className="mt-6 h-1 rounded-full bg-dark-secondary overflow-hidden">
                <div className="h-full w-2/3 bg-accent-green/70" />
              </div>
            </div>
          ))}
        </section>
      )}

      {/* All Campaigns Grid */}
      <section>
        <div className="mb-6">
          <h2 className="text-3xl font-orbitron text-text-primary">
            All Campaigns
          </h2>
          <p className="text-text-secondary text-sm mt-2">
            {campaigns.length} campaign{campaigns.length !== 1 ? "s" : ""}{" "}
            deployed
          </p>
        </div>

        {campaigns.length > 0 ? (
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
          !loading && (
            <div className="rounded-xl border border-dark-border bg-dark-card/50 p-12 text-center">
              <p className="text-text-secondary">No campaigns deployed yet.</p>
              <p className="text-text-muted text-sm mt-2">
                Be the first to create a campaign and help others!
              </p>
            </div>
          )
        )}
      </section>
      </div>
    </>
  );
}
