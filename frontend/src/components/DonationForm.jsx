import { useState } from "react";
import { ethers } from "ethers";
import { useWeb3 } from "../context/Web3Context";
import { useContract } from "../hooks/useContract";

export default function DonationForm({ campaignAddress, onSuccess }) {
  const { signer, account } = useWeb3();
  const { getCampaignContract } = useContract();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDonate = async (e) => {
    e.preventDefault();

    if (!signer) {
      alert("Please connect wallet first");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const campaign = getCampaignContract(campaignAddress);
      const donationAmount = ethers.parseEther(amount);

      const tx = await campaign.donate({ value: donationAmount });
      await tx.wait();

      setAmount("");
      alert("Donation successful!");
      onSuccess?.();
    } catch (err) {
      setError(err.message || "Donation failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleDonate}
      className="bg-dark-card border border-dark-border rounded-xl p-6"
    >
      <h3 className="font-orbitron text-sm font-bold tracking-[0.12em] uppercase text-text-primary mb-5">
        INITIATE TRANSFER
      </h3>

      <div className="mb-5">
        <label className="block text-[10px] font-medium tracking-[0.15em] uppercase text-text-muted mb-2">
          AMOUNT (MATIC)
        </label>
        <div className="relative">
          <input
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            required
            className="w-full px-4 py-3 bg-dark-secondary border border-dark-border rounded-lg 
                       text-text-primary font-mono text-sm placeholder-text-muted
                       focus:outline-none focus:border-accent-green focus:ring-1 focus:ring-accent-green/30
                       transition-all duration-200"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted text-xs font-mono">
            MATIC
          </span>
        </div>
      </div>

      {/* Quick amount buttons */}
      <div className="flex gap-2 mb-5">
        {["0.1", "0.5", "1.0", "5.0"].map((val) => (
          <button
            key={val}
            type="button"
            onClick={() => setAmount(val)}
            className="flex-1 py-2 text-xs font-mono border border-dark-border rounded-lg 
                       text-text-secondary hover:border-accent-green hover:text-accent-green 
                       transition-all duration-200"
          >
            {val}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs font-mono">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-accent-green text-dark-primary font-semibold rounded-lg 
                   hover:bg-accent-greenHover transition-all duration-200 
                   disabled:opacity-40 disabled:cursor-not-allowed
                   tracking-wide text-sm glow-green"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Processing...
          </span>
        ) : (
          "Confirm Transfer"
        )}
      </button>
    </form>
  );
}
