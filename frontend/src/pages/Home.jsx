import Card from "../components/Card";
import Header from "../components/Header";

const featuredCampaign = {
  address: "0xC123...A1B2",
  title: "Need Funds for Surgery",
  image:
    "https://tse2.mm.bing.net/th/id/OIP.A6sc9Jg4xc-RKuV4OsOD3QHaEO?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
  owner: "0xc538...eE27",
  category: "Health",
  required: 25,
  received: 9.4,
};

const statCards = [
  {
    label: "TOTAL CONTRIBUTIONS",
    value: "$45,280.00",
    accent: "text-text-primary",
  },
  { label: "ACTIVE CAMPAIGNS", value: "03", accent: "text-accent-green" },
  { label: "FUNDS RAISED", value: "$128,500.00", accent: "text-text-primary" },
];

const missionProtocols = [
  {
    name: "Project Ocean Clean",
    id: "D: P-9821A",
    progress: "85%",
    status: "LIVE",
  },
  {
    name: "Edu-Tech Initiative",
    id: "D: E-4412B",
    progress: "100%",
    status: "COMPLETED",
  },
  {
    name: "Urban Solar Grid",
    id: "D: U-1109C",
    progress: "0%",
    status: "PENDING",
  },
];

const telemetryFeed = [
  {
    text: "Incoming transfer detected.",
    amount: "+ $5,000.00",
    time: "2 MINS AGO",
  },
  {
    text: "Project Ocean Clean milestone reached.",
    amount: "Phase 2 Initiated",
    time: "1 HOUR AGO",
  },
  {
    text: "Security audit passed successfully.",
    amount: "Status: Secure",
    time: "3 HOURS AGO",
  },
];

const statusClasses = {
  LIVE: "bg-accent-green/20 text-accent-green border border-accent-green/30",
  COMPLETED: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
  PENDING: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
};

export default function Home() {
  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8">
      <section className="mb-8">
        <h1 className="text-5xl md:text-6xl font-orbitron leading-tight text-text-primary">
          CAMPAIGNS
        </h1>
      </section>

      <section className="mb-8 rounded-xl border border-dark-border bg-dark-card/70 overflow-hidden">
        <div className="p-4 border-b border-dark-border">
          <p className="font-mono text-xs tracking-[0.16em] uppercase text-accent-green flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent-green status-live" />
            Live Network Feed
          </p>
        </div>
        <div className="p-4">
          <Card campaign={featuredCampaign} />
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {statCards.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-dark-border bg-dark-card p-5 card-hover"
          >
            <p className="text-[11px] tracking-[0.14em] text-text-muted uppercase font-semibold mb-4">
              {item.label}
            </p>
            <p className={`text-5xl font-orbitron ${item.accent}`}>
              {item.value}
            </p>
            <div className="mt-6 h-1 rounded-full bg-dark-secondary overflow-hidden">
              <div className="h-full w-2/3 bg-accent-green/70" />
            </div>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl border border-dark-border bg-dark-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-orbitron text-text-primary">
              Mission Protocols
            </h2>
            <button className="text-xs tracking-[0.14em] uppercase text-text-secondary hover:text-accent-green transition-colors">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {missionProtocols.map((mission) => (
              <div
                key={mission.id}
                className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-lg border border-dark-border bg-dark-primary/50"
              >
                <div>
                  <p className="text-text-primary font-semibold">
                    {mission.name}
                  </p>
                  <p className="text-xs text-text-muted font-mono mt-1">
                    {mission.id}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-sm text-text-secondary">
                    Progress {mission.progress}
                  </p>
                  <span
                    className={`text-[10px] px-2 py-1 rounded-full tracking-[0.12em] uppercase font-semibold ${statusClasses[mission.status]}`}
                  >
                    {mission.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-dark-border bg-dark-card p-6">
          <h2 className="text-3xl font-orbitron text-text-primary mb-6">
            Telemetry Feed
          </h2>
          <div className="space-y-5">
            {telemetryFeed.map((item) => (
              <div key={item.text} className="flex gap-3">
                <span className="mt-1 w-2 h-2 rounded-full bg-accent-green shrink-0" />
                <div>
                  <p className="text-text-secondary">{item.text}</p>
                  <p className="text-accent-green font-semibold text-sm">
                    {item.amount}
                  </p>
                  <p className="text-xs text-text-muted font-mono mt-1">
                    {item.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
