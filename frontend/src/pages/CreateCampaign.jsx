/**
 * CreateCampaign.jsx - UPDATED WITH PINATA UPLOAD
 *
 * Replace your current frontend/src/pages/CreateCampaign.jsx with this
 *
 * CHANGES:
 * - Image file actually uploads to Pinata/IPFS
 * - Returns CID hash stored in contract
 * - Story text stored on-chain (contract has storyURI field)
 * - Shows upload progress
 *
 * REQUIRES .env var:
 * VITE_PINATA_JWT=your_pinata_jwt_token
 */

import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { useWeb3 } from "../context/Web3Context";
import { useContract } from "../hooks/useContract";
import { uploadToPinata } from "../services/campaignService";
import { formatEthersError } from "../utils/formatEthersError";

const categories = [
  "Tech & Infrastructure",
  "Health",
  "Education",
  "Animal",
  "Environment",
  "Poverty and Hunger",
  "Disaster Relief",
  "Children & Youth",
  "Women & Girls",
  "Blockchain and Crypto",
  "Other",
];

function LabelIcon({ children }) {
  return (
    <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] uppercase text-[#00F0FF]">
      <span className="font-mono text-[#00F0FF]/80">▸</span>
      {children}
    </span>
  );
}

export default function CreateCampaign() {
  const navigate = useNavigate();
  const { account, signer, ensurePolygonAmoy } = useWeb3();
  const { factoryContract } = useContract();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Tech & Infrastructure");
  const [fundingTarget, setFundingTarget] = useState("");
  const [story, setStory] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);
    const f = e.dataTransfer.files?.[0];
    if (f) {
      setSelectedFile(f);
      setFileName(f.name);
    }
  }, []);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const onDragLeave = useCallback(() => {
    setDragActive(false);
  }, []);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setSelectedFile(f);
      setFileName(f.name);
    }
  };

  const handleDeploy = async (e) => {
    e.preventDefault();
    setError("");

    if (!account || !signer) {
      setError("Connect your wallet first.");
      return;
    }
    if (!factoryContract) {
      setError("Factory contract not configured. Check VITE_FACTORY_ADDRESS.");
      return;
    }

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("Enter campaign title.");
      return;
    }
    if (!fundingTarget.trim()) {
      setError("Enter funding target.");
      return;
    }

    let requiredWei;
    try {
      requiredWei = ethers.parseEther(fundingTarget.trim());
    } catch {
      setError("Invalid funding amount.");
      return;
    }
    if (requiredWei <= 0n) {
      setError("Funding target must be > 0.");
      return;
    }

    // Switch to correct network
    const expectsAmoy =
      import.meta.env.VITE_NETWORK === "polygonAmoy" ||
      !import.meta.env.VITE_NETWORK;
    if (expectsAmoy) {
      try {
        await ensurePolygonAmoy();
      } catch (netErr) {
        console.error(netErr);
        setError(
          formatEthersError(netErr) ||
            "Switch to Polygon Amoy network in MetaMask.",
        );
        return;
      }
    }

    setDeploying(true);
    try {
      let imageURI = "";

      // Upload image if selected
      if (selectedFile) {
        setUploadingImage(true);
        try {
          imageURI = await uploadToPinata(selectedFile);
          console.log("Image uploaded. CID:", imageURI);
        } catch (uploadErr) {
          setError("Image upload failed: " + uploadErr.message);
          setDeploying(false);
          setUploadingImage(false);
          return;
        }
        setUploadingImage(false);
      } else {
        // Placeholder if no image
        imageURI =
          import.meta.env.VITE_PLACEHOLDER_IMAGE_CID || "QmPlaceholderImage";
      }

      const contract = factoryContract.connect(signer);

      // Validate before sending
      await contract.createCampaign.staticCall(
        trimmedTitle,
        requiredWei,
        imageURI,
        category,
        story.trim(),
      );

      // Send transaction
      const tx = await contract.createCampaign(
        trimmedTitle,
        requiredWei,
        imageURI,
        category,
        story.trim(),
      );

      await tx.wait();
      alert("Campaign deployed! Redirecting...");
      navigate("/");
    } catch (err) {
      console.error("Deployment error:", err);
      setError(formatEthersError(err) || "Deployment failed.");
    } finally {
      setDeploying(false);
      setUploadingImage(false);
    }
  };

  const handleSaveDraft = () => {
    try {
      const draft = {
        title,
        category,
        fundingTarget,
        story,
        fileName,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(
        "fundingapp:createCampaignDraft",
        JSON.stringify(draft),
      );
      alert("Draft saved to browser.");
    } catch {
      setError("Could not save draft.");
    }
  };

  return (
    <div className="max-w-[900px] mx-auto px-6 py-10 pb-16">
      <header className="mb-10">
        <h1 className="font-orbitron text-4xl md:text-5xl font-bold text-text-primary tracking-tight">
          Initiate Campaign
        </h1>
        <p className="mt-2 text-text-secondary text-sm md:text-base max-w-2xl">
          Configure parameters for tactical deployment of resources.
        </p>
      </header>

      <form
        onSubmit={handleDeploy}
        className="rounded-2xl border border-[#00F0FF]/25 bg-dark-card/90 p-6 md:p-10 shadow-[0_0_40px_-8px_rgba(0,240,255,0.15)]"
      >
        {error && (
          <div className="mb-6 rounded-lg border border-red-500/40 bg-red-950/40 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {/* Campaign Title */}
        <div className="mb-8">
          <label htmlFor="mission-title" className="block mb-3">
            <LabelIcon>Campaign Title</LabelIcon>
          </label>
          <input
            id="mission-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter campaign title..."
            className="w-full rounded-lg border border-dark-borderLight bg-dark-primary/80 px-4 py-3.5 text-text-primary placeholder:text-text-muted/60 outline-none transition focus:border-[#00F0FF]/50 focus:ring-1 focus:ring-[#00F0FF]/30"
          />
        </div>

        {/* Image Upload */}
        <div className="mb-8">
          <label className="block mb-3">
            <LabelIcon>Campaign Image (PNG/JPG)</LabelIcon>
          </label>
          <div
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ")
                fileInputRef.current?.click();
            }}
            onClick={() => fileInputRef.current?.click()}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            className={`flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 transition ${
              dragActive
                ? "border-[#00F0FF] bg-[#00F0FF]/5"
                : "border-dark-borderLight bg-dark-primary/40 hover:border-[#00F0FF]/40"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,.jpg,.jpeg,.png"
              className="hidden"
              onChange={handleFileChange}
            />
            <svg
              className="mb-4 h-12 w-12 text-[#00F0FF]/70"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.25}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="font-orbitron text-sm font-semibold tracking-[0.2em] text-text-primary">
              DRAG IMAGE OR CLICK
            </p>
            <p className="mt-2 text-xs text-text-muted">
              JPG or PNG (MAX 10MB)
            </p>
            {fileName && (
              <p className="mt-4 font-mono text-xs text-[#7CFF6B]">
                ✓ {fileName}
              </p>
            )}
            {uploadingImage && (
              <p className="mt-4 font-mono text-xs text-[#00F0FF]">
                Uploading to IPFS...
              </p>
            )}
          </div>
        </div>

        {/* Category + Funding Target */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="mission-category" className="block mb-3">
              <LabelIcon>Category</LabelIcon>
            </label>
            <div className="relative">
              <select
                id="mission-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full appearance-none rounded-lg border border-dark-borderLight bg-dark-primary/80 py-3.5 pl-4 pr-10 text-text-primary outline-none transition focus:border-[#00F0FF]/50 focus:ring-1 focus:ring-[#00F0FF]/30"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text-muted">
                ▼
              </span>
            </div>
          </div>
          <div>
            <label htmlFor="funding-target" className="block mb-3">
              <LabelIcon>Funding Target</LabelIcon>
            </label>
            <div className="flex gap-2">
              <input
                id="funding-target"
                type="text"
                inputMode="decimal"
                value={fundingTarget}
                onChange={(e) => setFundingTarget(e.target.value)}
                placeholder="0.00"
                className="min-w-0 flex-1 rounded-lg border border-dark-borderLight bg-dark-primary/80 px-4 py-3.5 font-mono text-text-primary placeholder:text-text-muted/60 outline-none transition focus:border-[#00F0FF]/50 focus:ring-1 focus:ring-[#00F0FF]/30"
              />
              <span className="flex shrink-0 items-center rounded-lg border border-dark-borderLight bg-dark-secondary px-4 text-xs font-semibold tracking-wider text-text-secondary">
                MATIC
              </span>
            </div>
          </div>
        </div>

        {/* Story / Description */}
        <div className="mb-10">
          <label htmlFor="mission-story" className="block mb-3">
            <LabelIcon>Campaign Story</LabelIcon>
          </label>
          <textarea
            id="mission-story"
            rows={8}
            value={story}
            onChange={(e) => setStory(e.target.value)}
            placeholder="Describe your campaign, goals, and impact..."
            className="w-full rounded-lg border border-dark-borderLight bg-dark-primary/60 px-4 py-4 text-text-primary placeholder:text-text-muted/50 outline-none transition focus:border-[#00F0FF]/50 focus:ring-1 focus:ring-[#00F0FF]/30 resize-y"
          />
          <p className="mt-2 text-xs text-text-muted">
            Max 3500 characters. Stored on blockchain.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="rounded-lg border border-dark-borderLight bg-transparent px-8 py-3.5 text-sm font-semibold tracking-wide text-text-primary transition hover:border-text-muted hover:bg-dark-secondary/50"
          >
            SAVE DRAFT
          </button>
          <button
            type="submit"
            disabled={deploying || uploadingImage}
            className="rounded-lg bg-[#7CFF6B] px-10 py-4 font-orbitron text-sm font-bold tracking-[0.2em] text-[#0B0E11] shadow-[0_0_24px_rgba(124,255,107,0.35)] transition hover:bg-[#8dff7d] hover:shadow-[0_0_32px_rgba(124,255,107,0.45)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploadingImage
              ? "UPLOADING IMAGE…"
              : deploying
                ? "DEPLOYING…"
                : "DEPLOY CAMPAIGN"}
          </button>
        </div>
      </form>
    </div>
  );
}
