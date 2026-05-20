import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWeb3 } from "../context/Web3Context";
import { useContract } from "../hooks/useContract";
import { deleteCampaign } from "../services/campaignService";
import { formatEthersError } from "../utils/formatEthersError";
import DeleteCampaignModal from "./DeleteCampaignModal";

export default function Card({ campaign, onDeleted }) {
  const navigate = useNavigate();
  const { account, signer, ensurePolygonAmoy } = useWeb3();
  const { factoryContractWithSigner } = useContract();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const progressPercent = (campaign.received / campaign.required) * 100;

  const isOwner =
    account?.toLowerCase() === campaign.owner?.toLowerCase();

  const getStatus = () => {
    if (progressPercent >= 100)
      return {
        label: "COMPLETED",
        color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      };
    if (progressPercent > 0)
      return {
        label: "LIVE",
        color: "bg-accent-green/20 text-accent-green border-accent-green/30",
      };
    return {
      label: "PENDING",
      color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    };
  };

  const status = getStatus();

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (!isOwner) return;
    setDeleteError("");
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!isOwner || !signer || !factoryContractWithSigner) {
      setDeleteError("Connect your wallet to delete this campaign.");
      return;
    }

    setDeleting(true);
    setDeleteError("");
    try {
      await ensurePolygonAmoy();
      await deleteCampaign(
        factoryContractWithSigner,
        campaign.address,
        account,
        campaign.owner,
      );
      setShowDeleteModal(false);
      onDeleted?.(campaign.address);
    } catch (err) {
      console.error("Delete failed:", err);
      setDeleteError(formatEthersError(err));
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    if (deleting) return;
    setShowDeleteModal(false);
    setDeleteError("");
  };

  return (
    <>
      <div
        onClick={() => navigate(`/campaign/${campaign.address}`)}
        className={`relative bg-dark-card border border-dark-border rounded-xl overflow-hidden 
                   hover:border-dark-borderLight hover:glow-green
                   transition-all duration-300 cursor-pointer group
                   ${deleting ? "pointer-events-none opacity-70" : ""}`}
      >
        {deleting && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-dark-primary/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
              <span className="h-10 w-10 rounded-full border-2 border-red-500/30 border-t-red-500 animate-spin" />
              <p className="font-orbitron text-xs tracking-widest text-red-300 uppercase">
                Deleting...
              </p>
            </div>
          </div>
        )}

        <div className="w-full h-48 bg-dark-secondary overflow-hidden relative">
          <img
            src={campaign.image}
            alt={campaign.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 right-3 flex items-center gap-2">
            {isOwner && (
              <button
                type="button"
                onClick={handleDeleteClick}
                disabled={deleting}
                title="Delete campaign"
                aria-label="Delete campaign"
                className="p-1.5 rounded-lg border border-red-500/40 bg-dark-primary/80 text-red-400
                           shadow-[0_0_12px_rgba(239,68,68,0.35)] hover:shadow-[0_0_20px_rgba(239,68,68,0.55)]
                           hover:text-red-300 hover:border-red-400/60 hover:scale-110
                           transition-all duration-200 backdrop-blur-sm"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            )}
            <span
              className={`text-[10px] font-semibold tracking-[0.12em] uppercase px-3 py-1 rounded-full border ${status.color}`}
            >
              {status.label}
            </span>
          </div>
        </div>

        <div className="p-5">
          <h3 className="font-inter font-semibold text-lg text-text-primary mb-1 group-hover:text-accent-green transition-colors">
            {campaign.title}
          </h3>

          <p className="font-mono text-xs text-text-muted mb-4">
            ID: {campaign.address.slice(0, 8)}...{campaign.address.slice(-4)}
          </p>

          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-text-muted">
              PROGRESS
            </span>
            <span className="font-mono text-sm font-semibold text-text-primary">
              {Math.min(progressPercent, 100).toFixed(0)}%
            </span>
          </div>

          <div className="w-full bg-dark-secondary rounded-full h-1.5 mb-4">
            <div
              className="bg-accent-green h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progressPercent, 100)}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-sm">
            <div>
              <span className="text-text-muted text-xs">Raised</span>
              <p className="font-mono font-semibold text-accent-green">
                {campaign.received.toFixed(2)} MATIC
              </p>
            </div>
            <div className="text-right">
              <span className="text-text-muted text-xs">Goal</span>
              <p className="font-mono font-semibold text-text-primary">
                {campaign.required.toFixed(2)} MATIC
              </p>
            </div>
          </div>

          <button
            type="button"
            className="w-full mt-4 py-2.5 border border-dark-border rounded-lg text-text-secondary text-sm font-medium
                            hover:border-accent-green hover:text-accent-green transition-all duration-200 
                            flex items-center justify-center gap-2"
          >
            View Protocol
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      <DeleteCampaignModal
        open={showDeleteModal}
        campaignTitle={campaign.title}
        loading={deleting}
        error={deleteError}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
}
