import { useState } from "react";
import { useWeb3 } from "../context/Web3Context";

export default function DonationForm({
  campaign,
  onDonate,
  loading = false,
  isOwner = false,
}) {
  const { account, connectWallet } = useWeb3();
  const [amount, setAmount] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const parsed = parseFloat(amount);
    if (!parsed || parsed <= 0) return;
    await onDonate(String(parsed));
    setAmount("");
  };

  const isComplete = campaign.received >= campaign.required;

  return (
    <div className="rounded-xl border border-dark-border bg-dark-card p-6 sticky top-8">
      <h2 className="text-xl font-orbitron font-bold text-text-primary mb-6">
        Support This Campaign
      </h2>

      {isComplete ? (
        <p className="text-accent-green text-sm font-semibold">
          This campaign has reached its funding goal.
        </p>
      ) : !account ? (
        <div>
          <p className="text-text-secondary text-sm mb-4">
            Connect your wallet to donate.
          </p>
          <button
            type="button"
            onClick={connectWallet}
            className="w-full rounded-lg bg-accent-green px-6 py-3 font-orbitron text-sm font-bold text-dark-primary hover:bg-[#8dff7d]"
          >
            Connect Wallet
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="donation-amount"
              className="block text-xs font-semibold tracking-[0.14em] uppercase text-text-muted mb-2"
            >
              Amount (MATIC)
            </label>
            <input
              id="donation-amount"
              type="number"
              min="0.001"
              step="0.001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.1"
              className="w-full rounded-lg border border-dark-border bg-dark-primary px-4 py-3 text-text-primary focus:border-accent-green focus:outline-none"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !amount}
            className="w-full rounded-lg bg-accent-green px-6 py-3 font-orbitron text-sm font-bold text-dark-primary hover:bg-[#8dff7d] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "Donate"}
          </button>
        </form>
      )}
    </div>
  );
}
