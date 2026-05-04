import { useWeb3 } from "../context/Web3Context";
import React from "react";

export default function WalletConnect() {
  const { account, connectWallet } = useWeb3();

  if (account) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center gap-3 bg-dark-card border border-accent-green/30 rounded-xl px-8 py-5">
          {/* Pulsing green dot */}
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-accent-green"></span>
          </span>
          <div>
            <p className="text-[10px] font-medium tracking-[0.15em] uppercase text-accent-green mb-0.5">
              WALLET CONNECTED
            </p>
            <p className="font-mono text-sm text-text-primary">{account}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="bg-dark-card border border-dark-border rounded-2xl p-10 text-center max-w-md">
        {/* Icon */}
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-dark-secondary border border-dark-borderLight flex items-center justify-center">
          <svg
            className="w-8 h-8 text-text-muted"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>

        <h2 className="font-orbitron text-xl font-bold text-text-primary mb-2 tracking-wide">
          AUTHENTICATION REQUIRED
        </h2>
        <p className="text-text-secondary text-sm mb-8 leading-relaxed">
          Connect your wallet to access the Command Center and interact with
          mission protocols.
        </p>

        <button
          onClick={connectWallet}
          className="w-full px-6 py-3 bg-accent-green text-dark-primary font-semibold rounded-lg 
                     hover:bg-accent-greenHover transition-all duration-200 
                     tracking-wide text-sm glow-green"
        >
          Connect MetaMask
        </button>
      </div>
    </div>
  );
}
