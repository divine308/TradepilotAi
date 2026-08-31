
import {
  BrainCircuit,
  CheckCircle2,
  Circle,
  ShieldCheck,
  TrendingUp,
  Zap,
} from "lucide-react";

const agents = [
  {
    name: "Market Agent",
    message: "Scanning market conditions",
    detail: "Monitoring price action and volatility",
    icon: TrendingUp,
    status: "ACTIVE",
  },
  {
    name: "Research Agent",
    message: "Evaluating market sentiment",
    detail: "Processing news and market signals",
    icon: BrainCircuit,
    status: "ACTIVE",
  },
  {
    name: "Strategy Agent",
    message: "Generating trade thesis",
    detail: "Searching for high-confidence setups",
    icon: Zap,
    status: "ACTIVE",
  },
  {
    name: "Risk Agent",
    message: "Validating portfolio exposure",
    detail: "Checking position and risk limits",
    icon: ShieldCheck,
    status: "READY",
  },
];

export default function AgentActivity() {
  const onlineAgents = agents.length;

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0b0d12] shadow-[0_20px_60px_rgba(0,0,0,0.18)]">

      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">

        <div>
          <div className="flex items-center gap-2">

            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-violet-400/[0.08] bg-violet-400/[0.07]">
              <BrainCircuit
                size={14}
                strokeWidth={1.8}
                className="text-violet-300"
              />
            </div>

            <h2 className="text-sm font-semibold tracking-[-0.01em] text-white">
              Agent activity
            </h2>

          </div>

          <p className="mt-1 text-[9px] text-zinc-600">
            Autonomous trading intelligence
          </p>
        </div>

        <div className="flex items-center gap-1.5 rounded-lg border border-emerald-400/[0.08] bg-emerald-400/[0.025] px-2.5 py-1.5">

          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>

          <span className="text-[8px] font-semibold uppercase tracking-wider text-emerald-400">
            {onlineAgents} online
          </span>

        </div>

      </div>

      {/* AGENTS */}
      <div className="divide-y divide-white/[0.045]">

        {agents.map(
          ({
            name,
            message,
            detail,
            icon: Icon,
            status,
          }) => {

            const isActive = status === "ACTIVE";

            return (
              <div
                key={name}
                className="group relative flex items-center gap-4 px-5 py-4 transition-colors hover:bg-white/[0.018]"
              >

                {/* ICON */}
                <div
                  className={[
                    "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-all",
                    isActive
                      ? "border-blue-400/[0.08] bg-blue-400/[0.035]"
                      : "border-emerald-400/[0.08] bg-emerald-400/[0.025]",
                    "group-hover:border-white/[0.1]",
                  ].join(" ")}
                >

                  <Icon
                    size={16}
                    strokeWidth={1.8}
                    className={
                      isActive
                        ? "text-blue-300/80"
                        : "text-emerald-300/80"
                    }
                  />

                  {isActive && (
                    <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.65)]" />
                  )}

                </div>

                {/* CONTENT */}
                <div className="min-w-0 flex-1">

                  <div className="flex items-center justify-between gap-3">

                    <span className="text-[11px] font-semibold text-zinc-200">
                      {name}
                    </span>

                    <span
                      className={[
                        "shrink-0 text-[7px] font-semibold uppercase tracking-[0.12em]",
                        isActive
                          ? "text-blue-400/60"
                          : "text-emerald-400/60",
                      ].join(" ")}
                    >
                      {status}
                    </span>

                  </div>

                  <p className="mt-1 truncate text-[10px] text-zinc-500">
                    {message}
                  </p>

                  <p className="mt-0.5 truncate text-[8px] text-zinc-700">
                    {detail}
                  </p>

                </div>

                {/* STATUS ICON */}
                <div className="hidden shrink-0 sm:block">

                  {isActive ? (
                    <Circle
                      size={13}
                      strokeWidth={1.8}
                      className="text-blue-400/50"
                    />
                  ) : (
                    <CheckCircle2
                      size={14}
                      strokeWidth={1.8}
                      className="text-emerald-400/60"
                    />
                  )}

                </div>

              </div>
            );
          }
        )}

      </div>

      {/* FOOTER */}
      <div className="flex items-center justify-between border-t border-white/[0.05] px-5 py-3">

        <div className="flex items-center gap-2">

          <span className="text-[8px] text-zinc-700">
            System
          </span>

          <span className="h-0.5 w-0.5 rounded-full bg-zinc-700" />

          <span className="text-[8px] font-medium text-zinc-500">
            Operating normally
          </span>

        </div>

        <div className="flex items-center gap-1.5">

          <span className="h-1 w-1 rounded-full bg-emerald-400/70" />

          <span className="text-[8px] text-zinc-700">
            Real-time
          </span>

        </div>

      </div>

    </div>
  );
}

