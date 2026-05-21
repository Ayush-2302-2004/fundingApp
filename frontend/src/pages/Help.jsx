/**
 * Help.jsx — Help Center page
 *
 * Layout: hero + search, help topics grid, FAQ accordion, contact CTA sidebar.
 */

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineMagnifyingGlass,
  HiOutlineChevronDown,
  HiOutlineChevronRight,
  HiOutlineArrowRight,
  HiOutlineEnvelope,
} from "react-icons/hi2";
import { FaDiscord, FaGithub, FaTelegram, FaXTwitter } from "react-icons/fa6";
import { BsHeadset } from "react-icons/bs";

const ICON_COLORS = {
  blue: "border-blue-400/50 text-blue-400 bg-blue-500/10",
  purple: "border-purple-400/50 text-purple-400 bg-purple-500/10",
  green: "border-accent-green/50 text-accent-green bg-accent-green/10",
  cyan: "border-cyan-400/50 text-cyan-400 bg-cyan-500/10",
  orange: "border-orange-400/50 text-orange-400 bg-orange-500/10",
  pink: "border-pink-400/50 text-pink-400 bg-pink-500/10",
};

const helpTopics = [
  {
    title: "Getting Started",
    desc: "Learn the basics of connecting your wallet and navigating the app.",
    color: "blue",
    path: "",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    ),
  },
  {
    title: "Creating Campaigns",
    desc: "Step-by-step guide to launching your first funding campaign.",
    color: "purple",
    path: "",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
      />
    ),
  },
  {
    title: "Voting & Governance",
    desc: "How proposals, votes, and on-chain governance work.",
    color: "green",
    path: "",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 19V6m0 13l-3-3m3 3l3-3M15 5v13m0-13l3 3m-3-3l-3 3"
      />
    ),
  },
  {
    title: "Wallet & Security",
    desc: "Connecting MetaMask, network settings, and keeping your funds safe.",
    color: "cyan",
    path: "",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M3 10h18M5 6h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2zm12 8h.01"
      />
    ),
  },
  {
    title: "Funds & Transactions",
    desc: "Contributing to campaigns, tracking payouts, and reading transactions.",
    color: "orange",
    path: "",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
  },
  {
    title: "Analytics & Reports",
    desc: "Understanding campaign stats, vote counts, and dashboard metrics.",
    color: "pink",
    path: "",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    ),
  },
];

const faqs = [
  {
    q: "How do I connect my wallet?",
    a: "Click Connect Wallet in the header and approve the MetaMask prompt. Make sure you are on the Polygon network before creating or funding campaigns.",
  },
  {
    q: "How do I create a new campaign?",
    a: "Go to Create Campaign, fill in the title, description, funding goal, and duration, then submit the transaction from your connected wallet.",
  },
  {
    q: "How does voting work on this platform?",
    a: "Voting is recorded on-chain. Connect your wallet, open a campaign, and cast your vote — each action is a transparent, verifiable transaction.",
  },
  {
    q: "Where can I see my contributions?",
    a: "Open Dashboard to view campaigns you created or supported, along with contribution history and live stats.",
  },
  {
    q: "What fees should I expect?",
    a: "You pay standard Polygon gas fees for transactions such as creating campaigns, donating, and voting. The app does not charge additional platform fees.",
  },
  {
    q: "Who can I contact for support?",
    a: "Use the Contact Support button to reach our team, or join the community on Discord, Telegram, or GitHub linked in the sidebar.",
  },
];

const socialLinks = [
  { icon: FaDiscord, href: "#", label: "Discord" },
  { icon: FaXTwitter, href: "#", label: "X" },
  { icon: FaTelegram, href: "#", label: "Telegram" },
  {
    icon: FaGithub,
    href: "https://github.com/Ayush-2302-2004/fundingApp",
    label: "GitHub",
  },
];

function SectionHeader({ label }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-accent-green whitespace-nowrap">
        • {label}
      </span>
      <span className="h-px flex-1 bg-dark-borderLight" />
    </div>
  );
}

function TopicCard({ topic, onClick }) {
  const colorClass = ICON_COLORS[topic.color] ?? ICON_COLORS.green;
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex items-center gap-4 w-full rounded-xl border border-dark-border
                 bg-dark-card/80 px-5 py-4 text-left transition-all duration-200
                 hover:border-accent-green/40 hover:bg-dark-card"
    >
      <div
        className={`shrink-0 w-12 h-12 rounded-full border flex items-center justify-center ${colorClass}`}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {topic.icon}
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-orbitron text-sm tracking-wide text-text-primary uppercase mb-1">
          {topic.title}
        </h3>
        <p className="text-text-secondary text-sm leading-snug">{topic.desc}</p>
      </div>
      <HiOutlineArrowRight className="shrink-0 w-5 h-5 text-text-muted group-hover:text-accent-green transition-colors" />
    </button>
  );
}

function FaqItem({ item, isOpen, onToggle }) {
  return (
    <div className="border-b border-dark-border last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center justify-between w-full py-4 text-left gap-4
                   hover:text-accent-green transition-colors"
      >
        <span className="font-inter text-sm md:text-base text-text-primary">
          {item.q}
        </span>
        <HiOutlineChevronDown
          className={`shrink-0 w-5 h-5 text-text-muted transition-transform duration-200
            ${isOpen ? "rotate-180 text-accent-green" : ""}`}
        />
      </button>
      {isOpen && (
        <p className="pb-4 text-text-secondary text-sm leading-relaxed pr-8">
          {item.a}
        </p>
      )}
    </div>
  );
}

export default function Help() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [openFaq, setOpenFaq] = useState(0);

  const filteredTopics = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return helpTopics;
    return helpTopics.filter(
      (t) =>
        t.title.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q),
    );
  }, [search]);

  const filteredFaqs = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return faqs;
    return faqs.filter(
      (f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q),
    );
  }, [search]);

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8 md:py-10">
      {/* Hero */}
      <section className="mb-10 md:mb-12">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 lg:gap-10">
          <div>
            <h1 className="font-orbitron text-4xl md:text-5xl lg:text-[3.25rem] leading-tight text-text-primary tracking-wide">
              HELP CENTRE
            </h1>
            <p className="mt-3 text-text-secondary text-base md:text-lg max-w-xl">
              Everything you need to know about The Funding App.
            </p>
          </div>

          <div className="w-full lg:max-w-md shrink-0">
            <div
              className="flex items-center gap-3 rounded-xl border border-accent-green/50
                            bg-dark-card/60 px-4 py-3 focus-within:border-accent-green
                            focus-within:shadow-[0_0_20px_rgba(0,230,118,0.12)] transition-all"
            >
              <HiOutlineMagnifyingGlass className="w-5 h-5 text-accent-green shrink-0" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for guides, topics or keywords..."
                className="flex-1 bg-transparent font-inter text-sm text-text-primary
                           placeholder:text-text-muted outline-none min-w-0"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Help topics */}
      <section className="mb-12 md:mb-14">
        <SectionHeader label="HELP TOPICS" />
        {filteredTopics.length === 0 ? (
          <p className="text-text-secondary text-sm py-6">
            No topics match your search.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredTopics.map((t) => (
              <TopicCard
                key={t.title}
                topic={t}
                onClick={() => navigate(t.path)}
              />
            ))}
          </div>
        )}
      </section>

      {/* FAQ + support */}
      <section className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 lg:gap-10">
        <div>
          <SectionHeader label="FREQUENTLY ASKED QUESTIONS" />
          <div className="rounded-xl border border-dark-border bg-dark-card/60 px-5 md:px-6">
            {filteredFaqs.length === 0 ? (
              <p className="text-text-secondary text-sm py-6">
                No FAQs match your search.
              </p>
            ) : (
              filteredFaqs.map((item, i) => (
                <FaqItem
                  key={item.q}
                  item={item}
                  isOpen={openFaq === i}
                  onToggle={() => setOpenFaq(openFaq === i ? -1 : i)}
                />
              ))
            )}
          </div>
        </div>

        <div className="lg:pt-9">
          <div
            className="rounded-xl border border-dark-border bg-dark-card/80 p-6
                          flex flex-col h-full"
          >
            <div className="flex items-center gap-3 mb-3">
              <BsHeadset className="w-6 h-6 text-accent-green" />
              <h3 className="font-orbitron text-sm tracking-[0.15em] uppercase text-text-primary">
                Still Need Help?
              </h3>
            </div>
            <p className="text-text-secondary text-sm mb-6 leading-relaxed">
              Our support team is here to help you.
            </p>

            <a
              href="mailto:support@thefundingapp.example"
              className="flex items-center justify-center gap-2 w-full rounded-xl border border-accent-green/60
                         bg-accent-green/5 py-3.5 font-inter text-sm font-medium text-text-primary
                         hover:bg-accent-green/10 hover:border-accent-green transition-all mb-6"
            >
              <HiOutlineEnvelope className="w-5 h-5 text-accent-green" />
              Contact Support
            </a>

            <p className="text-[#38bdf8] text-sm mb-3">Join our community</p>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noreferrer" : undefined}
                  aria-label={label}
                  className="w-10 h-10 rounded-full border border-dark-borderLight bg-dark-secondary
                             flex items-center justify-center text-text-secondary
                             hover:text-accent-green hover:border-accent-green/40 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>

            <button
              type="button"
              onClick={() => navigate("/about")}
              className="mt-6 flex items-center gap-2 text-sm text-text-secondary
                         hover:text-accent-green transition-colors group"
            >
              Learn more about the app
              <HiOutlineChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
