import { useWeb3 } from "../context/Web3Context";
import { useNavigate, useLocation } from "react-router-dom";

export default function Header() {
  const { account, connectWallet, disconnectWallet } = useWeb3();
  const navigate = useNavigate();
  const location = useLocation();

  const shortAddress = account
    ? `${account.slice(0, 6)}...${account.slice(-4)}`
    : "";

  const navItems = [
    { label: "CAMPAIGNS", path: "/" },
    { label: "CREATE CAMPAIGN", path: "/create" },
    { label: "DASHBOARD", path: "/dashboard" },
    { label: "ABOUT", path: "/about" },
    { label: "HELP", path: "/help" },
  ];

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="bg-dark-primary border-b border-dark-border sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => navigate("/")}
        >
          <span className="font-orbitron font-bold text-xl text-accent-green tracking-wider glow-green-text group-hover:text-accent-greenHover transition-colors">
            The FundingApp
          </span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`relative font-inter text-xs font-medium tracking-[0.15em] uppercase transition-colors duration-200 pb-1
                ${
                  isActive(item.path)
                    ? "text-accent-green"
                    : "text-text-secondary hover:text-text-primary"
                }`}
            >
              {item.label}
              {/* Active indicator underline */}
              {isActive(item.path) && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-accent-green rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Wallet Section */}
        <div className="flex items-center gap-3">
          {account ? (
            <div className="flex items-center gap-3">
              {/* Connected wallet badge */}
              <div className="flex items-center gap-3 bg-dark-card border border-dark-border rounded-lg px-4 py-2.5">
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-dark-secondary border border-dark-borderLight flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-text-secondary"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>

                <div className="flex flex-col">
                  <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-text-muted">
                    CONNECTED WALLET
                  </span>
                  <span className="font-mono text-sm text-text-primary">
                    {shortAddress}
                  </span>
                </div>

                {/* Settings gear */}
                <button
                  onClick={disconnectWallet}
                  className="ml-2 text-text-secondary hover:text-accent-green transition-colors"
                  title="Disconnect Wallet"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              className="font-inter text-sm font-medium px-6 py-2.5 border border-accent-green text-accent-green rounded-lg 
                         hover:bg-accent-green hover:text-dark-primary transition-all duration-200 
                         tracking-wide"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
