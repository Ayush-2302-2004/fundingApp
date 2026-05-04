import { useNavigate } from "react-router-dom";
import React from "react";

export default function Card({ campaign }) {
  const navigate = useNavigate();
  const progressPercent = (campaign.received / campaign.required) * 100;

  // Determine status
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

  return (
    <div
      onClick={() => navigate(`/campaign/${campaign.address}`)}
      className="bg-dark-card border border-dark-border rounded-xl overflow-hidden 
                 hover:border-dark-borderLight hover:glow-green
                 transition-all duration-300 cursor-pointer group"
    >
      {/* Image */}
      <div className="w-full h-48 bg-dark-secondary overflow-hidden relative">
        <img
          src={campaign.image}
          alt={campaign.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Status badge overlay */}
        <div className="absolute top-3 right-3">
          <span
            className={`text-[10px] font-semibold tracking-[0.12em] uppercase px-3 py-1 rounded-full border ${status.color}`}
          >
            {status.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-inter font-semibold text-lg text-text-primary mb-1 group-hover:text-accent-green transition-colors">
          {campaign.title}
        </h3>

        <p className="font-mono text-xs text-text-muted mb-4">
          ID: {campaign.address.slice(0, 8)}...{campaign.address.slice(-4)}
        </p>

        {/* Progress section */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-text-muted">
            PROGRESS
          </span>
          <span className="font-mono text-sm font-semibold text-text-primary">
            {Math.min(progressPercent, 100).toFixed(0)}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-dark-secondary rounded-full h-1.5 mb-4">
          <div
            className="bg-accent-green h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(progressPercent, 100)}%` }}
          />
        </div>

        {/* Amounts */}
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

        {/* View button */}
        <button
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
  );
}
