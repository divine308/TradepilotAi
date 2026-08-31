
import {
  Bot,
  BriefcaseBusiness,
  ChartCandlestick,
  ChevronRight,
  KeyRound,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  X,
  Zap,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const navigation = [
  {
    name: "Command Center",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "AI Trading",
    path: "/agents",
    icon: Bot,
    badge: "AI",
  },
  {
    name: "Markets",
    path: "/markets",
    icon: ChartCandlestick,
  },
  {
    name: "Portfolio",
    path: "/portfolio",
    icon: BriefcaseBusiness,
  },
  {
    name: "API Access",
    path: "/api-keys",
    icon: KeyRound,
  },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* =====================================================
          MOBILE BACKDROP
      ====================================================== */}

      <div
        onClick={onClose}
        className={`
          fixed
          inset-0
          z-40
          bg-[#17151f]/20
          backdrop-blur-[2px]
          transition-opacity
          duration-300
          lg:hidden
          ${
            open
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }
        `}
      />

      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <aside
        className={`
          fixed
          inset-y-0
          left-0
          z-50
          flex
          w-[264px]
          shrink-0
          flex-col
          overflow-y-auto
          border-r
          border-[#e7e2db]
          bg-[#fbfaf8]
          shadow-[14px_0_45px_rgba(45,35,70,0.08)]
          transition-transform
          duration-300
          ease-out

          lg:static
          lg:z-auto
          lg:translate-x-0
          lg:overflow-visible
          lg:shadow-none

          ${
            open
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >

        {/* =====================================================
            MOBILE CLOSE BUTTON
        ====================================================== */}

        <button
          type="button"
          onClick={onClose}
          aria-label="Close navigation menu"
          className="
            absolute
            right-4
            top-5
            z-20
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-xl
            border
            border-[#e7e2db]
            bg-white
            text-[#8d8791]
            shadow-sm
            transition
            hover:border-[#ded5ff]
            hover:bg-[#f1edff]
            hover:text-[#7859f4]
            lg:hidden
          "
        >
          <X
            size={17}
            strokeWidth={1.8}
          />
        </button>

        {/* =====================================================
            BRAND
        ====================================================== */}

        <div
          className="
            flex
            h-[76px]
            shrink-0
            items-center
            border-b
            border-[#e9e5df]
            px-5
          "
        >
          <NavLink
            to="/dashboard"
            onClick={onClose}
            className="group flex items-center gap-3"
          >

            <div
              className="
                relative
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                border
                border-[#e4def5]
                bg-[#f1edff]
                transition
                group-hover:border-[#cfc2ff]
                group-hover:bg-[#ebe5ff]
              "
            >
              <div className="h-2.5 w-2.5 rounded-[3px] bg-[#7859f4]" />

              <span
                className="
                  absolute
                  right-[-2px]
                  top-[-2px]
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-[#a56ce8]
                "
              />
            </div>

            <div>
              <div
                className="
                  text-[13px]
                  font-bold
                  tracking-[-0.02em]
                  text-[#17151f]
                "
              >
                TRADE PILOT
              </div>

              <div
                className="
                  mt-0.5
                  text-[8px]
                  font-medium
                  uppercase
                  tracking-[0.2em]
                  text-[#aaa3ad]
                "
              >
                Intelligence infrastructure
              </div>
            </div>

          </NavLink>
        </div>

        {/* =====================================================
            CONNECTION STATUS
        ====================================================== */}

        <div className="shrink-0 px-4 pt-5">

          <div
            className="
              flex
              items-center
              justify-between
              rounded-xl
              border
              border-[#dcefe6]
              bg-[#f1fff8]
              px-3
              py-2.5
            "
          >

            <div className="flex items-center gap-2.5">

              <span className="relative flex h-1.5 w-1.5">

                <span
                  className="
                    absolute
                    h-full
                    w-full
                    animate-ping
                    rounded-full
                    bg-[#35c98b]
                    opacity-40
                  "
                />

                <span
                  className="
                    relative
                    h-1.5
                    w-1.5
                    rounded-full
                    bg-[#35c98b]
                  "
                />

              </span>

              <span
                className="
                  text-[10px]
                  font-medium
                  text-[#5f776c]
                "
              >
                Trading engine
              </span>

            </div>

            <span
              className="
                text-[8px]
                font-bold
                uppercase
                tracking-[0.14em]
                text-[#26966b]
              "
            >
              Online
            </span>

          </div>

        </div>

        {/* =====================================================
            NAVIGATION
        ====================================================== */}

        <div className="shrink-0 px-3 pt-7">

          <div
            className="
              mb-3
              px-3
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.18em]
              text-[#aaa3ad]
            "
          >
            Workspace
          </div>

          <nav className="space-y-1">

            {navigation.map(
              ({
                name,
                path,
                icon: Icon,
                badge,
              }) => (

                <NavLink
                  key={path}
                  to={path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    [
                      `
                        group
                        relative
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        px-3
                        py-2.5
                        text-[11px]
                        font-medium
                        transition-all
                        duration-200
                      `,

                      isActive
                        ? "bg-[#f1edff] text-[#30283d]"
                        : "text-[#77717f] hover:bg-[#f5f2ee] hover:text-[#302b38]",
                    ].join(" ")
                  }
                >

                  {({ isActive }) => (
                    <>

                      {isActive && (
                        <span
                          className="
                            absolute
                            left-0
                            top-1/2
                            h-5
                            w-[3px]
                            -translate-y-1/2
                            rounded-r-full
                            bg-[#7859f4]
                          "
                        />
                      )}

                      <div
                        className={[
                          `
                            flex
                            h-8
                            w-8
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            border
                            transition
                          `,

                          isActive
                            ? "border-[#ded5ff] bg-white text-[#7859f4] shadow-sm"
                            : "border-[#ebe7e2] bg-white/70 text-[#8d8791] group-hover:border-[#ded8ec] group-hover:bg-white group-hover:text-[#655d70]",
                        ].join(" ")}
                      >

                        <Icon
                          size={15}
                          strokeWidth={isActive ? 2 : 1.7}
                          className={
                            isActive
                              ? "text-[#7859f4]"
                              : "text-[#8d8791] group-hover:text-[#655d70]"
                          }
                        />

                      </div>

                      <span className="flex-1">
                        {name}
                      </span>

                      {badge && (
                        <span
                          className="
                            rounded-md
                            border
                            border-[#ded5ff]
                            bg-[#f5f1ff]
                            px-1.5
                            py-0.5
                            text-[7px]
                            font-bold
                            uppercase
                            tracking-wider
                            text-[#7859f4]
                          "
                        >
                          {badge}
                        </span>
                      )}

                      {isActive && (
                        <ChevronRight
                          size={12}
                          strokeWidth={1.8}
                          className="text-[#aaa3ad]"
                        />
                      )}

                    </>
                  )}

                </NavLink>

              )
            )}

          </nav>

        </div>

        {/* =====================================================
            AI STATUS
            No mt-auto here.
            This prevents Settings from being pushed below
            the mobile viewport.
        ====================================================== */}

        <div className="shrink-0 px-4 pb-4 pt-6">

          <div
            className="
              relative
              overflow-hidden
              rounded-[20px]
              border
              border-[#e4ddf1]
              bg-[#f7f4ff]
            "
          >

            <div
              className="
                pointer-events-none
                absolute
                -right-16
                -top-16
                h-32
                w-32
                rounded-full
                bg-[#b9a5ff]/20
                blur-3xl
              "
            />

            <div className="relative p-4">

              <div className="mb-4 flex items-center justify-between">

                <div className="flex items-center gap-2.5">

                  <div
                    className="
                      flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-xl
                      bg-white
                      shadow-sm
                    "
                  >
                    <Bot
                      size={14}
                      strokeWidth={1.8}
                      className="text-[#7859f4]"
                    />
                  </div>

                  <div>

                    <p
                      className="
                        text-[10px]
                        font-semibold
                        text-[#393240]
                      "
                    >
                      AI Engine
                    </p>

                    <p
                      className="
                        mt-0.5
                        text-[8px]
                        uppercase
                        tracking-wider
                        text-[#958da2]
                      "
                    >
                      Autonomous analyst
                    </p>

                  </div>

                </div>

                <span
                  className="
                    flex
                    items-center
                    gap-1.5
                    rounded-full
                    bg-[#edfff7]
                    px-2
                    py-1
                    text-[7px]
                    font-bold
                    uppercase
                    tracking-wider
                    text-[#26966b]
                  "
                >
                  <span className="h-1 w-1 rounded-full bg-[#35c98b]" />
                  Ready
                </span>

              </div>

              <p
                className="
                  text-[9px]
                  leading-relaxed
                  text-[#918a9a]
                "
              >
                Market intelligence is active and
                ready to evaluate your strategy.
              </p>

              <div
                className="
                  mt-4
                  flex
                  items-center
                  gap-2
                  border-t
                  border-[#e7e0f0]
                  pt-3
                "
              >

                <Zap
                  size={11}
                  strokeWidth={1.8}
                  className="text-[#7859f4]"
                />

                <span
                  className="
                    text-[8px]
                    font-medium
                    uppercase
                    tracking-wider
                    text-[#8f879b]
                  "
                >
                  Continuous analysis
                </span>

              </div>

            </div>

          </div>

          {/* SYSTEM STATUS */}

          <div
            className="
              mt-3
              flex
              items-center
              justify-between
              px-1
            "
          >

            <div className="flex items-center gap-2">

              <ShieldCheck
                size={12}
                strokeWidth={1.7}
                className="text-[#aaa3ad]"
              />

              <span
                className="
                  text-[8px]
                  uppercase
                  tracking-wider
                  text-[#aaa3ad]
                "
              >
                Paper environment
              </span>

            </div>

            <span
              className="
                text-[8px]
                font-medium
                text-[#aaa3ad]
              "
            >
              v1.0
            </span>

          </div>

        </div>

        {/* =====================================================
            SETTINGS
            Always part of the sidebar flow.
            Visible on mobile through scrolling if necessary.
        ====================================================== */}

        <div
          className="
            mt-auto
            shrink-0
            border-t
            border-[#e9e5df]
            bg-[#fbfaf8]
            px-3
            py-3
          "
        >

          <NavLink
            to="/settings"
            onClick={onClose}
            className={({ isActive }) =>
              [
                `
                  group
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  px-3
                  py-2.5
                  text-[11px]
                  font-medium
                  transition
                `,

                isActive
                  ? "bg-[#f1edff] text-[#30283d]"
                  : "text-[#77717f] hover:bg-[#f5f2ee] hover:text-[#302b38]",
              ].join(" ")
            }
          >

            {({ isActive }) => (
              <>

                <div
                  className={[
                    "flex h-8 w-8 items-center justify-center rounded-lg border transition",
                    isActive
                      ? "border-[#ded5ff] bg-white shadow-sm"
                      : "border-[#ebe7e2] bg-white/70 group-hover:border-[#ded8ec] group-hover:bg-white",
                  ].join(" ")}
                >

                  <Settings
                    size={15}
                    strokeWidth={isActive ? 2 : 1.7}
                    className={
                      isActive
                        ? "text-[#7859f4]"
                        : "text-[#8d8791] group-hover:text-[#655d70]"
                    }
                  />

                </div>

                <span className="flex-1">
                  Settings
                </span>

                <ChevronRight
                  size={12}
                  className={[
                    "transition",
                    isActive
                      ? "text-[#aaa3ad]"
                      : "text-[#c1bbc4] group-hover:translate-x-0.5",
                  ].join(" ")}
                />

              </>
            )}

          </NavLink>

        </div>

      </aside>
    </>
  );
}

