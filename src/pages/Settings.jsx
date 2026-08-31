
import {
  Bell,
  Check,
  ChevronRight,
  CircleHelp,
  Globe2,
  KeyRound,
  LockKeyhole,
  LogOut,
  MonitorCog,
  Moon,
  Palette,
  Save,
  ShieldCheck,
  UserRound,
  WalletCards,
  CircleCheck,
  Sparkles,
  Settings as SettingsIcon,
} from "lucide-react";

import { useState } from "react";

import AppLayout from "../components/AppLayout";

/* ============================================================
   SETTINGS SECTIONS
============================================================ */

const sections = [
  {
    id: "profile",
    name: "Profile",
    description: "Workspace identity",
    icon: UserRound,
  },
  {
    id: "trading",
    name: "Trading",
    description: "Execution preferences",
    icon: WalletCards,
  },
  {
    id: "notifications",
    name: "Notifications",
    description: "Alerts and updates",
    icon: Bell,
  },
  {
    id: "security",
    name: "Security",
    description: "Account protection",
    icon: ShieldCheck,
  },
  {
    id: "appearance",
    name: "Appearance",
    description: "Interface preferences",
    icon: Palette,
  },
];

/* ============================================================
   SETTINGS
============================================================ */

export default function Settings() {
  const [activeSection, setActiveSection] = useState("profile");

  const [settings, setSettings] = useState({
    marketAlerts: true,
    tradeSignals: true,
    agentUpdates: true,
    emailNotifications: false,
    paperTrading: true,
    aiExecution: true,
    compactInterface: false,
  });

  const toggle = (key) => {
    setSettings((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  return (
    <AppLayout>
      <div className="relative min-h-screen overflow-hidden bg-[#f7f6f2] text-[#17151f]">
        {/* =====================================================
            AMBIENT BACKGROUND
        ====================================================== */}

        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -left-32 top-20 h-[420px] w-[420px] rounded-full bg-[#c7b7ff]/20 blur-[120px]" />

          <div className="absolute right-[-100px] top-[280px] h-[420px] w-[420px] rounded-full bg-[#a8f3d0]/20 blur-[130px]" />

          <div className="absolute bottom-[-200px] left-[40%] h-[400px] w-[500px] rounded-full bg-[#ffd8c8]/20 blur-[140px]" />
        </div>

        {/* =====================================================
            MAIN CONTENT
        ====================================================== */}

        <main className="relative mx-auto max-w-[1700px] px-5 py-7 sm:px-8 lg:px-10">
          {/* =================================================
              PAGE HEADER
          ================================================= */}

          <section className="mb-8">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#17151f] text-white shadow-sm">
                    <SettingsIcon size={13} />
                  </span>

                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#7b7487]">
                    Workspace configuration
                  </span>
                </div>

                <h1 className="text-4xl font-semibold tracking-[-0.055em] text-[#17151f] sm:text-5xl">
                  Settings
                  <span className="text-[#7f5cff]">
                    {" "}
                    control everything.
                  </span>
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-[#77717f]">
                  Configure your Trade Pilot identity, trading environment,
                  notifications, security and interface.
                </p>
              </div>

              {/* HEADER STATUS */}

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 rounded-xl border border-[#dcefe6] bg-[#f1fff8] px-4 py-2.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inset-0 animate-ping rounded-full bg-[#35c98b] opacity-50" />
                    <span className="relative h-2 w-2 rounded-full bg-[#35c98b]" />
                  </span>

                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#26966b]">
                    Workspace active
                  </span>
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-[#e7e3dc] bg-white px-4 py-2.5 shadow-[0_8px_25px_rgba(40,30,60,0.04)]">
                  <Globe2 size={13} className="text-[#8a8391]" />

                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#77717f]">
                    UTC · v1.0
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* =================================================
              SETTINGS CONTENT
          ================================================= */}

          <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
            {/* =================================================
                VERTICAL SETTINGS NAVIGATION
            ================================================= */}

            <aside>
              <div className="lg:sticky lg:top-24">
                <div className="mb-3 px-2">
                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#9a939f]">
                    Configuration
                  </p>
                </div>

                <nav className="flex flex-col gap-2">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    const active = activeSection === section.id;

                    return (
                      <button
                        key={section.id}
                        type="button"
                        onClick={() => setActiveSection(section.id)}
                        className={[
                          "group relative flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition duration-200",
                          active
                            ? "border-[#e4dcf5] bg-[#f5f1ff] shadow-[0_10px_30px_rgba(90,70,150,0.05)]"
                            : "border-transparent bg-transparent hover:border-[#ebe7e1] hover:bg-white",
                        ].join(" ")}
                      >
                        {active && (
                          <span className="absolute left-0 top-1/2 h-7 w-[3px] -translate-y-1/2 rounded-r-full bg-[#7859f4]" />
                        )}

                        <div
                          className={[
                            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition",
                            active
                              ? "bg-white text-[#7859f4] shadow-sm"
                              : "bg-[#eeece8] text-[#8e8793] group-hover:bg-[#f1edff] group-hover:text-[#7859f4]",
                          ].join(" ")}
                        >
                          <Icon size={15} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p
                            className={[
                              "text-xs font-semibold",
                              active
                                ? "text-[#332d3c]"
                                : "text-[#625b68]",
                            ].join(" ")}
                          >
                            {section.name}
                          </p>

                          <p className="mt-1 truncate text-[8px] text-[#a29aa6]">
                            {section.description}
                          </p>
                        </div>

                        {active && (
                          <ChevronRight
                            size={13}
                            className="shrink-0 text-[#9a83e8]"
                          />
                        )}
                      </button>
                    );
                  })}
                </nav>

                {/* HELP CARD */}

                <div className="mt-6 rounded-[20px] border border-[#e7e2db] bg-white p-4 shadow-[0_12px_35px_rgba(45,35,70,0.035)]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f5f3f8]">
                      <CircleHelp
                        size={15}
                        className="text-[#817987]"
                      />
                    </div>

                    <div>
                      <p className="text-[10px] font-semibold text-[#403a47]">
                        Need help?
                      </p>

                      <p className="mt-1 text-[8px] text-[#a29aa5]">
                        Open Trade Pilot docs
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="group mt-4 flex items-center gap-1 text-[8px] font-bold uppercase tracking-[0.12em] text-[#7859f4]"
                  >
                    Documentation

                    <ChevronRight
                      size={10}
                      className="transition group-hover:translate-x-1"
                    />
                  </button>
                </div>
              </div>
            </aside>

            {/* =================================================
                SETTINGS PANEL
            ================================================= */}

            <div className="min-w-0">
              {activeSection === "profile" && <ProfileSection />}

              {activeSection === "trading" && (
                <TradingSection
                  settings={settings}
                  toggle={toggle}
                />
              )}

              {activeSection === "notifications" && (
                <NotificationsSection
                  settings={settings}
                  toggle={toggle}
                />
              )}

              {activeSection === "security" && <SecuritySection />}

              {activeSection === "appearance" && (
                <AppearanceSection
                  settings={settings}
                  toggle={toggle}
                />
              )}

              {/* SYSTEM FOOTER */}

              <div className="mt-6 flex flex-col gap-3 border-t border-[#e7e2db] pt-5 text-[8px] font-semibold uppercase tracking-[0.16em] text-[#aaa3ad] sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="flex items-center gap-2 text-[#756d80]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#35c98b]" />
                    Trade Pilot AI
                  </span>

                  <span>Workspace configuration</span>
                </div>

                <span>Intelligence infrastructure</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AppLayout>
  );
}

/* ============================================================
   SECTION HEADER
============================================================ */

function SectionHeader({
  icon: Icon,
  title,
  description,
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-[#eeeae5] px-6 py-5 sm:flex-row sm:items-center">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#f1edff]">
        <Icon size={18} className="text-[#7859f4]" />
      </div>

      <div>
        <h2 className="text-sm font-semibold text-[#211e28]">
          {title}
        </h2>

        <p className="mt-1 text-[9px] leading-5 text-[#97909b]">
          {description}
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   PROFILE
============================================================ */

function ProfileSection() {
  return (
    <section className="overflow-hidden rounded-[26px] border border-[#e7e2db] bg-white shadow-[0_20px_60px_rgba(45,35,70,0.05)]">
      <SectionHeader
        icon={UserRound}
        title="Profile"
        description="Manage your workspace identity and account information."
      />

      <div className="p-6 sm:p-7">
        <div className="flex flex-col gap-5 border-b border-[#eeeae5] pb-7 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[20px] bg-[#f1edff] text-lg font-bold text-[#7859f4]">
            TP
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-[#29242f]">
                Trade Pilot User
              </p>

              <span className="rounded-full bg-[#edfff7] px-2.5 py-1 text-[7px] font-bold uppercase tracking-wider text-[#26966b]">
                Active
              </span>
            </div>

            <p className="mt-1 break-all text-[9px] text-[#99919d]">
              trader@tradepilot.ai
            </p>

            <button
              type="button"
              className="mt-3 text-[8px] font-bold uppercase tracking-[0.12em] text-[#7859f4] transition hover:text-[#6244d8]"
            >
              Change avatar
            </button>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-xl border border-[#e8e4de] bg-[#faf9f7] px-3 py-2">
            <CircleCheck size={12} className="text-[#35b984]" />

            <span className="text-[8px] font-bold uppercase tracking-wider text-[#817b85]">
              Verified workspace
            </span>
          </div>
        </div>

        <div className="grid gap-5 pt-7 sm:grid-cols-2">
          <ProfileInput
            label="Display name"
            value="Trade Pilot User"
          />

          <ProfileInput
            label="Email"
            value="trader@tradepilot.ai"
          />
        </div>

        <div className="mt-5">
          <ProfileInput
            label="Workspace"
            value="Trade Pilot"
          />
        </div>

        <button
          type="button"
          className="group mt-7 flex items-center gap-2 rounded-xl bg-[#17151f] px-4 py-3 text-[9px] font-bold uppercase tracking-[0.13em] text-white shadow-[0_12px_25px_rgba(23,21,31,0.12)] transition hover:-translate-y-0.5 hover:bg-[#262231]"
        >
          <Save size={12} />

          Save changes

          <ChevronRight
            size={11}
            className="transition group-hover:translate-x-1"
          />
        </button>
      </div>
    </section>
  );
}

/* ============================================================
   PROFILE INPUT
============================================================ */

function ProfileInput({
  label,
  value,
}) {
  return (
    <label className="block">
      <span className="text-[8px] font-bold uppercase tracking-[0.15em] text-[#97909b]">
        {label}
      </span>

      <input
        defaultValue={value}
        className="mt-2 w-full rounded-xl border border-[#e7e2db] bg-[#faf9f7] px-3.5 py-3 text-[10px] font-medium text-[#4b4552] outline-none transition focus:border-[#cfc3ef] focus:bg-white focus:ring-2 focus:ring-[#f1edff]"
      />
    </label>
  );
}

/* ============================================================
   TRADING
============================================================ */

function TradingSection({
  settings,
  toggle,
}) {
  return (
    <section className="overflow-hidden rounded-[26px] border border-[#e7e2db] bg-white shadow-[0_20px_60px_rgba(45,35,70,0.05)]">
      <SectionHeader
        icon={WalletCards}
        title="Trading environment"
        description="Control execution, market defaults and AI trading behavior."
      />

      <div className="px-6 sm:px-7">
        <SettingRow
          title="Paper trading"
          description="Keep all trading activity inside a simulated environment."
          icon={WalletCards}
        >
          <Toggle
            enabled={settings.paperTrading}
            onClick={() => toggle("paperTrading")}
          />
        </SettingRow>

        <SettingRow
          title="AI execution assistance"
          description="Allow Trade Pilot agents to prepare structured execution recommendations."
          icon={Sparkles}
        >
          <Toggle
            enabled={settings.aiExecution}
            onClick={() => toggle("aiExecution")}
          />
        </SettingRow>

        <SettingRow
          title="Default market"
          description="Select the default market shown throughout your workspace."
          icon={Globe2}
        >
          <SelectButton>US Equities</SelectButton>
        </SettingRow>

        <SettingRow
          title="Base currency"
          description="Currency used for portfolio and performance calculations."
          icon={WalletCards}
        >
          <SelectButton>USD</SelectButton>
        </SettingRow>
      </div>
    </section>
  );
}

/* ============================================================
   NOTIFICATIONS
============================================================ */

function NotificationsSection({
  settings,
  toggle,
}) {
  return (
    <section className="overflow-hidden rounded-[26px] border border-[#e7e2db] bg-white shadow-[0_20px_60px_rgba(45,35,70,0.05)]">
      <SectionHeader
        icon={Bell}
        title="Notifications"
        description="Choose how Trade Pilot communicates market and agent activity."
      />

      <div className="px-6 sm:px-7">
        <SettingRow
          title="Market alerts"
          description="Receive alerts when important market conditions are detected."
          icon={Bell}
        >
          <Toggle
            enabled={settings.marketAlerts}
            onClick={() => toggle("marketAlerts")}
          />
        </SettingRow>

        <SettingRow
          title="Trade signals"
          description="Notify you when agents identify high-confidence opportunities."
          icon={Sparkles}
        >
          <Toggle
            enabled={settings.tradeSignals}
            onClick={() => toggle("tradeSignals")}
          />
        </SettingRow>

        <SettingRow
          title="Agent activity"
          description="Receive updates when autonomous agents complete important analysis."
          icon={MonitorCog}
        >
          <Toggle
            enabled={settings.agentUpdates}
            onClick={() => toggle("agentUpdates")}
          />
        </SettingRow>

        <SettingRow
          title="Email notifications"
          description="Send important workspace notifications to your registered email."
          icon={Globe2}
        >
          <Toggle
            enabled={settings.emailNotifications}
            onClick={() => toggle("emailNotifications")}
          />
        </SettingRow>
      </div>
    </section>
  );
}

/* ============================================================
   SECURITY
============================================================ */

function SecuritySection() {
  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-[26px] border border-[#e7e2db] bg-white shadow-[0_20px_60px_rgba(45,35,70,0.05)]">
        <SectionHeader
          icon={ShieldCheck}
          title="Security"
          description="Protect your Trade Pilot account and connected applications."
        />

        <div className="px-6 sm:px-7">
          <SettingRow
            title="Password"
            description="Update your account password to keep your workspace secure."
            icon={LockKeyhole}
          >
            <ActionButton icon={LockKeyhole}>
              Change password
            </ActionButton>
          </SettingRow>

          <SettingRow
            title="API credentials"
            description="Manage applications and credentials connected to your workspace."
            icon={KeyRound}
          >
            <ActionButton icon={KeyRound}>
              Manage keys
            </ActionButton>
          </SettingRow>

          <SettingRow
            title="Active sessions"
            description="Review devices that currently have access to your account."
            icon={MonitorCog}
          >
            <div className="flex w-fit items-center gap-2 rounded-full bg-[#edfff7] px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#35c98b]" />

              <span className="text-[8px] font-bold uppercase tracking-wider text-[#26966b]">
                1 active session
              </span>
            </div>
          </SettingRow>
        </div>
      </section>

      {/* DANGER ZONE */}

      <div className="rounded-[22px] border border-[#f2dcd7] bg-[#fff7f4] p-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff0eb]">
              <LogOut size={15} className="text-[#d35d4e]" />
            </div>

            <div>
              <p className="text-[10px] font-semibold text-[#443b42]">
                Sign out of all sessions
              </p>

              <p className="mt-1 text-[8px] text-[#a29391]">
                This will invalidate all active sessions.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="rounded-xl border border-[#efcfc8] bg-white px-3.5 py-2.5 text-[8px] font-bold uppercase tracking-[0.12em] text-[#c95a4c] transition hover:bg-[#fff0eb]"
          >
            Sign out everywhere
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   APPEARANCE
============================================================ */

function AppearanceSection({
  settings,
  toggle,
}) {
  return (
    <section className="overflow-hidden rounded-[26px] border border-[#e7e2db] bg-white shadow-[0_20px_60px_rgba(45,35,70,0.05)]">
      <SectionHeader
        icon={Palette}
        title="Appearance"
        description="Customize the Trade Pilot interface and workspace experience."
      />

      <div className="px-6 sm:px-7">
        <SettingRow
          title="Interface theme"
          description="Trade Pilot uses a bright intelligence workspace designed for clarity."
          icon={Moon}
        >
          <div className="flex items-center gap-2 rounded-xl border border-[#e0d8f3] bg-[#f5f1ff] px-3.5 py-2.5">
            <Moon size={12} className="text-[#7859f4]" />

            <span className="text-[9px] font-bold text-[#7859f4]">
              Light
            </span>

            <Check size={11} className="text-[#7859f4]" />
          </div>
        </SettingRow>

        <SettingRow
          title="Accent color"
          description="Primary interface highlight used for actions, signals and system states."
          icon={Palette}
        >
          <div className="flex items-center gap-2 rounded-xl border border-[#e8e4de] bg-[#faf9f7] px-3 py-2">
            <span className="h-5 w-5 rounded-lg bg-[#7859f4]" />

            <span className="text-[9px] font-semibold text-[#6e6874]">
              Violet
            </span>
          </div>
        </SettingRow>

        <SettingRow
          title="Compact interface"
          description="Reduce spacing across dashboard components to display more information."
          icon={MonitorCog}
        >
          <Toggle
            enabled={settings.compactInterface}
            onClick={() => toggle("compactInterface")}
          />
        </SettingRow>
      </div>
    </section>
  );
}

/* ============================================================
   SETTING ROW
============================================================ */

function SettingRow({
  title,
  description,
  children,
  icon: Icon,
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-[#eeeae5] py-5 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        {Icon && (
          <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f7f5f2] text-[#8b8490] sm:flex">
            <Icon size={14} />
          </div>
        )}

        <div className="max-w-xl">
          <p className="text-[11px] font-semibold text-[#3a3441]">
            {title}
          </p>

          <p className="mt-1 text-[9px] leading-5 text-[#9a939e]">
            {description}
          </p>
        </div>
      </div>

      <div className="shrink-0">{children}</div>
    </div>
  );
}

/* ============================================================
   TOGGLE
============================================================ */

function Toggle({
  enabled,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={enabled}
      aria-label="Toggle setting"
      className={[
        "relative h-6 w-11 shrink-0 rounded-full border transition duration-200",
        enabled
          ? "border-[#d7cef1] bg-[#f1edff]"
          : "border-[#e2ded8] bg-[#f3f1ee]",
      ].join(" ")}
    >
      <span
        className={[
          "absolute top-1 h-4 w-4 rounded-full shadow-sm transition-all duration-200",
          enabled
            ? "left-6 bg-[#7859f4]"
            : "left-1 bg-[#aaa3ad]",
        ].join(" ")}
      />
    </button>
  );
}

/* ============================================================
   SELECT BUTTON
============================================================ */

function SelectButton({
  children,
}) {
  return (
    <button
      type="button"
      className="flex items-center gap-3 rounded-xl border border-[#e7e2db] bg-[#faf9f7] px-3.5 py-2.5 text-[9px] font-semibold text-[#625b68] transition hover:border-[#d8d0e7] hover:bg-white hover:text-[#332d39]"
    >
      {children}

      <ChevronRight size={11} className="text-[#9c95a0]" />
    </button>
  );
}

/* ============================================================
   ACTION BUTTON
============================================================ */

function ActionButton({
  children,
  icon: Icon,
}) {
  return (
    <button
      type="button"
      className="flex items-center gap-2 rounded-xl border border-[#e7e2db] bg-[#faf9f7] px-3.5 py-2.5 text-[8px] font-bold uppercase tracking-[0.08em] text-[#6f6874] transition hover:border-[#d8d0e7] hover:bg-white hover:text-[#332d39]"
    >
      <Icon size={11} />

      {children}
    </button>
  );
}

