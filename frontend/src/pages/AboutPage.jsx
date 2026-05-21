/**
 * About.jsx
 *
 * About page for The Funding App.
 * Matches the existing dark-navy + cyan/green cyberpunk theme used across
 * Home, Dashboard, Header, etc. Uses tokens from tailwind.config.js
 * (accent-green, dark-*, text-*) and font families orbitron / inter / mono.
 */

import { useNavigate } from "react-router-dom";
import { useWeb3 } from "../context/Web3Context";
import { FaEthereum } from "react-icons/fa";
import {
  SiReact,
  SiTailwindcss,
  SiSolidity,
  SiIpfs,
  SiVercel,
} from "react-icons/si";

/* ---------- inline data ---------- */
const features = [
  {
    title: "Transparent Voting",
    desc: "Every vote is recorded on-chain — immutable, verifiable, and auditable by anyone.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    title: "Decentralized Campaigns",
    desc: "Create campaigns, raise funds, and track every transaction on the blockchain in real time.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-5a4 4 0 11-8 0 4 4 0 018 0zm6 0a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
  },
  {
    title: "Wallet Authentication",
    desc: "Secure login using your crypto wallet — no passwords, no centralized accounts.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 10h18M5 6h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2zm12 8h.01"
        />
      </svg>
    ),
  },
  {
    title: "Real-Time Governance",
    desc: "Live results, campaign analytics, and proposal tracking for a fully decentralized experience.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 19V6m0 13l-3-3m3 3l3-3M15 5v13m0-13l3 3m-3-3l-3 3"
        />
      </svg>
    ),
  },
];

const techStack = [
  { name: "React.js", icon: <SiReact className="w-6 h-6 text-[#61DAFB]" /> },
  {
    name: "Tailwind CSS",
    icon: <SiTailwindcss className="w-6 h-6 text-[#38BDF8]" />,
  },
  { name: "Solidity", icon: <SiSolidity className="w-6 h-6 text-[#A78BFA]" /> },
  {
    name: "Hardhat",
    icon: (
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Yellow_hard_hat.svg"
        alt="Hardhat"
        className="w-6 h-6 object-contain"
      />
    ),
  },
  {
    name: "Ethers.js",
    icon: <FaEthereum className="w-6 h-6 text-[#A78BFA]" />,
  },
  {
    name: "MetaMask",
    icon: (
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
        alt="MetaMask"
        className="w-6 h-6 object-contain"
      />
    ),
  },
  { name: "IPFS", icon: <SiIpfs className="w-6 h-6 text-[#65C2CB]" /> },
  { name: "Vercel", icon: <SiVercel className="w-5 h-5 text-white" /> },
];

const OCTAGON_CLIP =
  "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)";

function TechStackIcon({ children }) {
  return (
    <div
      className="w-11 h-11 flex items-center justify-center bg-[#0b1220] border border-indigo-500/25"
      style={{ clipPath: OCTAGON_CLIP }}
    >
      {children}
    </div>
  );
}

const stats = [
  { label: "Total Campaigns", value: "28" },
  { label: "Total Votes", value: "1.2K+" },
  { label: "Connected Wallets", value: "350+" },
  { label: "Total Raised", value: "12.45 MATIC" },
];

const steps = [
  {
    n: "01",
    title: "Create Campaign",
    desc: "Anyone can create a campaign and set funding goals on-chain.",
  },
  {
    n: "02",
    title: "Connect Wallet",
    desc: "Connect your wallet to securely interact with the platform.",
  },
  {
    n: "03",
    title: "Vote & Support",
    desc: "Participate in voting and support campaigns transparently.",
  },
  {
    n: "04",
    title: "Track Everything",
    desc: "Track funds, votes and results in real-time on the blockchain.",
  },
];

/* ---------- small building blocks ---------- */
function Pill({ children }) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-md border border-accent-green/30
                     bg-accent-green/10 px-3 py-1.5 font-mono text-[11px] tracking-[0.18em]
                     uppercase text-accent-green"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-accent-green status-live" />
      {children}
    </span>
  );
}

function SectionTitle({ children }) {
  return (
    <div className="flex items-center justify-center gap-4 mb-10">
      <span className="h-px w-12 bg-dark-borderLight" />
      <h2 className="text-xl md:text-2xl font-orbitron tracking-[0.18em] text-text-primary">
        {children}
      </h2>
      <span className="h-px w-12 bg-dark-borderLight" />
    </div>
  );
}

/* ---------- page ---------- */
export default function About() {
  const navigate = useNavigate();
  const { account, connectWallet } = useWeb3();

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10">
      {/* ============ HERO ============ */}
      <section
        className="relative overflow-hidden rounded-2xl border border-dark-border
                          bg-dark-card/70 p-8 md:p-12 mb-12 glow-green"
      >
        {/* decorative grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]
                        bg-[linear-gradient(rgba(0,230,118,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(0,230,118,0.4)_1px,transparent_1px)]
                        bg-[size:42px_42px]"
        />

        <div className="relative grid md:grid-cols-2 gap-8 items-center">
          <div>
            <Pill>About Us</Pill>
            <h1 className="mt-5 font-orbitron text-4xl md:text-5xl leading-tight text-text-primary">
              Decentralized
              <br />
              <span className="text-accent-green glow-green-text">
                Governance.
              </span>
              <br />
              Powered by{" "}
              <span className="text-[#00F0FF] drop-shadow-[0_0_12px_rgba(0,240,255,0.35)]">
                Blockchain.
              </span>
            </h1>
            <p className="mt-5 text-text-secondary leading-relaxed max-w-lg">
              Funding App is a decentralized platform for creating campaigns,
              raising funds, and enabling transparent voting on the blockchain.
              We're building a trustless ecosystem where communities can govern,
              decide and build together.
            </p>

            <div className="flex flex-wrap gap-3 mt-6">
              {["Transparent", "Secure", "Community Driven"].map((t) => (
                <span
                  key={t}
                  className="rounded-md border border-dark-borderLight bg-dark-secondary
                             px-3 py-1.5 font-mono text-[11px] tracking-[0.16em] uppercase text-text-primary"
                >
                  ◆ {t}
                </span>
              ))}
            </div>
          </div>

          {/* hero visual */}
          <div className="relative flex items-center justify-center">
            <div className="relative w-64 h-64 md:w-72 md:h-72">
              <div
                className="absolute inset-0 rounded-2xl bg-gradient-to-br
                              from-accent-green/20 via-[#00F0FF]/10 to-transparent blur-2xl"
              />
              <div
                className="absolute inset-0 rounded-2xl border border-accent-green/30
                              rotate-12 animate-pulse-slow"
              />
              <div className="absolute inset-4 rounded-2xl border border-[#00F0FF]/30 -rotate-6" />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="w-24 h-24 text-accent-green drop-shadow-[0_0_24px_rgba(0,230,118,0.55)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.2}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CORE FEATURES ============ */}
      <section className="mb-12">
        <SectionTitle>Core Features</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-dark-border bg-dark-card p-5 card-hover"
            >
              <div
                className="w-11 h-11 rounded-lg border border-accent-green/30
                              bg-accent-green/10 text-accent-green flex items-center justify-center mb-4"
              >
                {f.icon}
              </div>
              <h3 className="font-orbitron text-sm tracking-[0.1em] text-text-primary uppercase mb-2">
                {f.title}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                {f.desc}
              </p>
              <div className="mt-4 h-px w-10 bg-accent-green/60" />
            </div>
          ))}
        </div>
      </section>

      {/* ============ TECH STACK ============ */}
      <section className="mb-12">
        <SectionTitle>Tech Stack</SectionTitle>
        <div className="rounded-xl border border-dark-border bg-dark-card px-6 py-8">
          <div className="flex flex-wrap justify-center items-start gap-6 sm:gap-8 md:gap-10 lg:gap-12">
            {techStack.map((t) => (
              <div
                key={t.name}
                className="flex flex-col items-center gap-2.5 min-w-[72px]"
              >
                <TechStackIcon>{t.icon}</TechStackIcon>
                <span className="font-mono text-[11px] tracking-wide text-text-secondary text-center">
                  {t.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ STATS ============ */}
      <section className="mb-12">
        <div className="rounded-xl border border-dark-border bg-dark-card p-6 glow-green">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-orbitron text-3xl md:text-4xl text-accent-green glow-green-text">
                  {s.value}
                </p>
                <p className="mt-2 font-mono text-[10px] tracking-[0.2em] uppercase text-text-muted">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="mb-12">
        <SectionTitle>How It Works</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((s, i) => (
            <div
              key={s.n}
              className="relative rounded-xl border border-dark-border
                                       bg-dark-card p-5 card-hover"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="font-orbitron text-2xl text-accent-green">
                  {s.n}
                </span>
                <span
                  className="w-9 h-9 rounded-lg border border-accent-green/30
                                 bg-accent-green/10 text-accent-green flex items-center justify-center"
                >
                  <span className="font-mono text-xs">→</span>
                </span>
              </div>
              <h3 className="font-orbitron text-sm tracking-[0.1em] uppercase text-text-primary mb-2">
                {s.title}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                {s.desc}
              </p>
              {i < steps.length - 1 && (
                <span className="hidden lg:block absolute top-1/2 -right-2 text-accent-green/40">
                  ›
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ============ MISSION + CTA ============ */}
      <section className="grid md:grid-cols-2 gap-4 mb-12">
        <div className="rounded-xl border border-dark-border bg-dark-card p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1 h-5 bg-accent-green rounded-full" />
            <h3 className="font-orbitron text-sm tracking-[0.18em] uppercase text-text-primary">
              Our Mission
            </h3>
          </div>
          <p className="text-text-secondary text-sm leading-relaxed">
            Our mission is to empower communities through decentralized
            governance and transparent funding. We believe blockchain technology
            can bring fairness, trust and real transparency to voting and
            fundraising systems.
          </p>
        </div>

        <div className="rounded-xl border border-dark-border bg-dark-card p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1 h-5 bg-[#00F0FF] rounded-full" />
            <h3 className="font-orbitron text-sm tracking-[0.18em] uppercase text-text-primary">
              A Final-Year Student Project
            </h3>
          </div>
          <p className="text-text-secondary text-sm leading-relaxed mb-5">
            Built by passionate developers exploring the future of Web3 —
            transparent, trustless, community-owned.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://github.com/Ayush-2302-2004/fundingApp"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border
                          border-dark-borderLight bg-dark-secondary text-text-primary
                          font-mono text-xs tracking-wider hover:border-accent-green/50
                          hover:text-accent-green transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 .5C5.73.5.99 5.24.99 11.5c0 4.86 3.15 8.98 7.52 10.43.55.1.75-.24.75-.53v-1.86c-3.06.66-3.7-1.47-3.7-1.47-.5-1.28-1.23-1.62-1.23-1.62-1-.69.08-.67.08-.67 1.1.08 1.68 1.13 1.68 1.13.98 1.67 2.57 1.19 3.2.91.1-.71.38-1.19.7-1.46-2.44-.28-5-1.22-5-5.44 0-1.2.43-2.18 1.13-2.95-.11-.28-.49-1.4.11-2.92 0 0 .92-.3 3.02 1.13a10.5 10.5 0 015.5 0c2.1-1.43 3.02-1.13 3.02-1.13.6 1.52.22 2.64.11 2.92.7.77 1.13 1.75 1.13 2.95 0 4.23-2.57 5.16-5.02 5.43.39.34.74 1 .74 2.02v3c0 .29.2.64.76.53A11 11 0 0023 11.5C23 5.24 18.27.5 12 .5z" />
              </svg>
              View GitHub
            </a>
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg
                         bg-[#00F0FF] text-[#0B0E11] font-inter text-xs font-semibold tracking-wider
                         shadow-[0_0_20px_rgba(0,240,255,0.35)]
                         hover:bg-[#5ff] hover:shadow-[0_0_28px_rgba(0,240,255,0.45)] transition-all"
            >
              Live Demo ↗
            </button>
            {!account && (
              <button
                onClick={connectWallet}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border
                           border-accent-green/40 bg-accent-green/10 text-accent-green
                           font-inter text-xs font-semibold tracking-wider
                           hover:bg-accent-green/20 transition-colors"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ============ FOOTER QUOTE ============ */}
      <section className="rounded-xl border border-dark-border bg-dark-card/50 p-5 text-center">
        <p className="font-mono text-sm text-text-secondary">
          <span className="text-accent-green">"</span> Building a transparent
          future, one block at a time.
          <span className="text-accent-green">"</span>
        </p>
      </section>
    </div>
  );
}
// export default function AboutPage() {
//   const features = [
//     {
//       title: "Transparent Voting",
//       desc: "Every vote is recorded on-chain, immutable and verifiable by anyone.",
//       icon: "🗳️",
//     },
//     {
//       title: "Decentralized Campaigns",
//       desc: "Create campaigns, raise funds and track transactions in real time.",
//       icon: "👥",
//     },
//     {
//       title: "Wallet Authentication",
//       desc: "Secure login using MetaMask and decentralized identity.",
//       icon: "👛",
//     },
//     {
//       title: "Real-Time Governance",
//       desc: "Track voting statistics and campaign analytics live.",
//       icon: "📊",
//     },
//   ];

//   const techStack = [
//     "React.js",
//     <img
//       src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"
//       alt="React Logo"
//       width="25"
//     />,
//     "Tailwind CSS",
//     "Solidity",
//     "Hardhat",
//     "Ethers.js",
//     "MetaMask",
//     "IPFS",
//     "Vercel",
//   ];

//   const workflow = [
//     {
//       step: "01",
//       title: "Create Campaign",
//       desc: "Anyone can create campaigns and funding goals securely.",
//     },
//     {
//       step: "02",
//       title: "Connect Wallet",
//       desc: "Connect MetaMask wallet to interact with the platform.",
//     },
//     {
//       step: "03",
//       title: "Vote & Support",
//       desc: "Participate in transparent blockchain voting.",
//     },
//     {
//       step: "04",
//       title: "Track Everything",
//       desc: "Monitor funds, votes and governance analytics.",
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-black text-white overflow-hidden">
//       <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.15),transparent_40%)]"></div>

//       {/* Navbar */}
//       <nav className="relative z-10 flex items-center justify-between px-10 py-6 border-b border-fuchsia-900/40 backdrop-blur-md">
//         <div>
//           <h1 className="text-3xl font-bold tracking-wider text-fuchsia-500">
//             FUNDING APP
//           </h1>
//           <p className="text-xs text-fuchsia-300 tracking-[6px]">APP</p>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <section className="relative z-10 grid lg:grid-cols-2 gap-10 items-center px-10 lg:px-20 py-20">
//         <div>
//           <div className="inline-block border border-fuchsia-500/40 px-4 py-2 rounded-lg text-sm uppercase tracking-widest text-fuchsia-400 mb-6">
//             About Us
//           </div>

//           <h1 className="text-5xl md:text-7xl font-black leading-tight uppercase">
//             Decentralized
//             <span className="block text-fuchsia-500">Governance.</span>
//             <span className="block text-cyan-400">Powered By Blockchain.</span>
//           </h1>

//           <p className="text-gray-400 mt-8 text-lg leading-relaxed max-w-xl">
//             Funding App is a decentralized platform for creating campaigns,
//             raising funds and enabling transparent voting on blockchain. We’re
//             building a trustless ecosystem where communities can govern, decide
//             and build together.
//           </p>

//           <div className="flex flex-wrap gap-4 mt-8">
//             {["Transparent", "Secure", "Community Driven"].map((item) => (
//               <div
//                 key={item}
//                 className="border border-fuchsia-500/40 bg-fuchsia-500/5 px-5 py-3 rounded-xl text-sm tracking-wide"
//               >
//                 {item}
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="relative flex justify-center">
//           <div className="absolute w-96 h-96 bg-fuchsia-500/20 blur-[120px] rounded-full"></div>

//           <div className="relative w-[380px] h-[380px] rounded-3xl border border-fuchsia-500/30 bg-gradient-to-br from-fuchsia-500/10 to-cyan-500/10 backdrop-blur-xl flex items-center justify-center shadow-[0_0_50px_rgba(217,70,239,0.4)]">
//             <div className="w-56 h-56 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-violet-700 flex items-center justify-center text-8xl shadow-[0_0_50px_rgba(217,70,239,0.6)]">
//               🗳️
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Features */}
//       <section className="relative z-10 px-10 lg:px-20 py-16">
//         <h2 className="text-center text-3xl font-bold uppercase tracking-[6px] mb-14 text-fuchsia-400">
//           Core Features
//         </h2>

//         <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
//           {features.map((feature) => (
//             <div
//               key={feature.title}
//               className="rounded-3xl border border-fuchsia-500/20 bg-white/5 backdrop-blur-md p-8 hover:-translate-y-2 transition-all duration-300 shadow-[0_0_25px_rgba(217,70,239,0.15)]"
//             >
//               <div className="text-5xl mb-6">{feature.icon}</div>
//               <h3 className="text-2xl font-semibold mb-4 text-fuchsia-300">
//                 {feature.title}
//               </h3>
//               <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Tech Stack */}
//       <section className="relative z-10 px-10 lg:px-20 py-10">
//         <h2 className="text-center text-3xl font-bold uppercase tracking-[6px] mb-12 text-cyan-400">
//           Tech Stack
//         </h2>

//         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
//           {techStack.map((tech) => (
//             <div
//               key={tech}
//               className="rounded-2xl border border-cyan-500/20 bg-white/5 p-6 text-center backdrop-blur-md hover:border-fuchsia-500 transition-all"
//             >
//               <div className="text-xl font-semibold text-gray-200">{tech}</div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Stats */}
//       <section className="relative z-10 px-10 lg:px-20 py-16">
//         <div className="grid md:grid-cols-4 gap-6 rounded-3xl border border-fuchsia-500/20 bg-gradient-to-r from-fuchsia-500/10 to-cyan-500/10 p-10 backdrop-blur-xl shadow-[0_0_40px_rgba(168,85,247,0.15)]">
//           {[
//             ["28", "Total Campaigns"],
//             ["1.2K+", "Total Votes"],
//             ["350+", "Connected Wallets"],
//             ["12.45 ETH", "Total Raised"],
//           ].map(([value, label]) => (
//             <div key={label} className="text-center">
//               <h3 className="text-4xl font-black text-fuchsia-400 mb-2">
//                 {value}
//               </h3>
//               <p className="uppercase tracking-widest text-gray-400 text-sm">
//                 {label}
//               </p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Workflow */}
//       <section className="relative z-10 px-10 lg:px-20 py-16">
//         <h2 className="text-center text-3xl font-bold uppercase tracking-[6px] mb-14 text-fuchsia-400">
//           How It Works
//         </h2>

//         <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
//           {workflow.map((item) => (
//             <div
//               key={item.step}
//               className="rounded-3xl border border-fuchsia-500/20 bg-white/5 p-8 backdrop-blur-md hover:shadow-[0_0_30px_rgba(217,70,239,0.25)] transition-all"
//             >
//               <div className="text-5xl font-black text-fuchsia-500 mb-6">
//                 {item.step}
//               </div>

//               <h3 className="text-2xl font-semibold mb-4">{item.title}</h3>
//               <p className="text-gray-400 leading-relaxed">{item.desc}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Bottom Cards */}
//       <section className="relative z-10 px-10 lg:px-20 py-10 grid lg:grid-cols-2 gap-8">
//         <div className="rounded-3xl border border-fuchsia-500/20 bg-white/5 p-10 backdrop-blur-xl min-h-[260px] flex flex-col justify-between">
//           <div>
//             <h2 className="text-3xl font-bold mb-6 text-fuchsia-400 uppercase">
//               Our Mission
//             </h2>
//             <p className="text-gray-400 text-lg leading-relaxed">
//               Our mission is to empower communities through decentralized
//               governance and transparent funding. We believe blockchain
//               technology can bring fairness, trust and real transparency to
//               voting and fundraising systems.
//             </p>
//           </div>

//           <div className="mt-8 text-fuchsia-500 text-sm tracking-[5px] uppercase">
//             Building a transparent future.
//           </div>
//         </div>

//         <div className="rounded-3xl border border-cyan-500/20 bg-white/5 p-10 backdrop-blur-xl min-h-[260px] flex flex-col justify-between">
//           <div>
//             <h2 className="text-3xl font-bold mb-6 text-cyan-400 uppercase">
//               Final Year Student Project
//             </h2>

//             <p className="text-gray-400 text-lg leading-relaxed">
//               Built with passion to explore decentralized governance,
//               blockchain-based voting systems and transparent campaign
//               management using modern Web3 technologies.
//             </p>
//           </div>

//           <div className="flex flex-wrap gap-4 mt-8">
//             <button className="px-6 py-3 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500 hover:bg-fuchsia-500/20 transition-all">
//               View GitHub
//             </button>

//             <button className="px-6 py-3 rounded-xl bg-cyan-500/10 border border-cyan-500 hover:bg-cyan-500/20 transition-all">
//               Live Demo
//             </button>

//             <button className="px-6 py-3 rounded-xl border border-gray-700 hover:border-fuchsia-500 transition-all">
//               Contract Explorer
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="relative z-10 py-10 text-center text-gray-500 text-sm tracking-widest uppercase border-t border-fuchsia-500/10 mt-10">
//         Building a transparent future, one block at a time.
//       </footer>
//     </div>
//   );
// }
