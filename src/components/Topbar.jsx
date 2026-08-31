
import {
  Bell,
  ChevronDown,
  CircleHelp,
  Command,
  Menu,
  Radio,
  Search,
  ShieldCheck,
} from "lucide-react";

export default function Topbar({ onMenu }) {
  return (
    <header
      className="
        sticky
        top-0
        z-30
        flex
        h-[68px]
        items-center
        justify-between
        border-b
        border-[#e7e2db]
        bg-[#f7f6f2]/95
        px-4
        backdrop-blur-2xl
        sm:px-8
      "
    >
      {/* LEFT */}
      <div className="flex min-w-0 items-center gap-3 sm:gap-5">

        {/* MOBILE MENU */}
        <button
          type="button"
          onClick={onMenu}
          aria-label="Open navigation menu"
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            border
            border-[#e7e2db]
            bg-white
            text-[#696270]
            shadow-[0_4px_14px_rgba(45,35,70,0.025)]
            transition
            hover:border-[#d9d0ef]
            hover:bg-[#f1edff]
            hover:text-[#7859f4]
            lg:hidden
          "
        >
          <Menu
            size={19}
            strokeWidth={1.8}
          />
        </button>

        {/* MARKET STATUS */}
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
                opacity-30
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

          <div>
            <p
              className="
                text-[8px]
                font-semibold
                uppercase
                tracking-[0.18em]
                text-[#918a96]
              "
            >
              Markets
            </p>

            <p
              className="
                mt-0.5
                text-[10px]
                font-semibold
                text-[#26966b]
              "
            >
              Live
            </p>
          </div>

        </div>

        {/* DIVIDER */}
        <div
          className="
            hidden
            h-6
            w-px
            bg-[#e7e2db]
            sm:block
          "
        />

        {/* TRADING ENVIRONMENT */}
        <div
          className="
            hidden
            items-center
            gap-2
            sm:flex
          "
        >
          <ShieldCheck
            size={13}
            strokeWidth={1.8}
            className="text-[#8f8794]"
          />

          <span
            className="
              text-[10px]
              font-medium
              text-[#696270]
            "
          >
            Paper Trading
          </span>

          <ChevronDown
            size={12}
            className="text-[#aaa3ad]"
          />
        </div>

      </div>

      {/* CENTER — SEARCH */}
      <div
        className="
          absolute
          left-1/2
          hidden
          -translate-x-1/2
          md:block
        "
      >
        <button
          type="button"
          className="
            flex
            w-72
            items-center
            gap-3
            rounded-xl
            border
            border-[#e7e2db]
            bg-white
            px-3
            py-2
            text-left
            shadow-[0_6px_20px_rgba(45,35,70,0.025)]
            transition
            hover:border-[#d9d0ef]
            hover:bg-[#fcfbff]
          "
        >
          <Search
            size={13}
            strokeWidth={1.8}
            className="text-[#aaa3ad]"
          />

          <span
            className="
              flex-1
              text-[10px]
              text-[#aaa3ad]
            "
          >
            Search markets, symbols...
          </span>

          <span
            className="
              flex
              items-center
              gap-1
              rounded-md
              border
              border-[#e8e4de]
              bg-[#faf9f7]
              px-1.5
              py-0.5
              text-[8px]
              text-[#aaa3ad]
            "
          >
            <Command size={8} />
            K
          </span>
        </button>
      </div>

      {/* RIGHT — CONTROLS */}
      <div className="flex items-center gap-1">

        {/* ALPACA CONNECTION */}
        <div
          className="
            mr-2
            hidden
            items-center
            gap-2
            rounded-xl
            border
            border-[#dcefe6]
            bg-[#f1fff8]
            px-2.5
            py-1.5
            lg:flex
          "
        >
          <span className="relative flex h-1.5 w-1.5">
            <span
              className="
                absolute
                h-full
                w-full
                animate-ping
                rounded-full
                bg-[#35c98b]
                opacity-30
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

          <Radio
            size={11}
            strokeWidth={1.8}
            className="text-[#26966b]"
          />

          <span
            className="
              text-[8px]
              font-semibold
              uppercase
              tracking-wider
              text-[#26966b]
            "
          >
            Alpaca
          </span>
        </div>

        {/* HELP */}
        <button
          type="button"
          aria-label="Help"
          className="
            rounded-xl
            p-2.5
            text-[#96909a]
            transition
            hover:bg-[#f1edff]
            hover:text-[#7859f4]
          "
        >
          <CircleHelp
            size={16}
            strokeWidth={1.7}
          />
        </button>

        {/* NOTIFICATIONS */}
        <button
          type="button"
          aria-label="Notifications"
          className="
            relative
            rounded-xl
            p-2.5
            text-[#96909a]
            transition
            hover:bg-[#f1edff]
            hover:text-[#7859f4]
          "
        >
          <Bell
            size={16}
            strokeWidth={1.7}
          />

          <span
            className="
              absolute
              right-2.5
              top-2.5
              h-1.5
              w-1.5
              rounded-full
              bg-[#35c98b]
            "
          />
        </button>

        {/* PROFILE */}
        <button
          type="button"
          aria-label="Account menu"
          className="
            ml-1
            flex
            items-center
            gap-2
            rounded-xl
            border
            border-transparent
            px-2
            py-1.5
            transition
            hover:border-[#e7e2db]
            hover:bg-white
          "
        >
          <div
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-xl
              border
              border-[#e3dcef]
              bg-[#f1edff]
              text-[9px]
              font-bold
              text-[#7859f4]
            "
          >
            TP
          </div>

          <ChevronDown
            size={12}
            className="
              hidden
              text-[#aaa3ad]
              sm:block
            "
          />
        </button>

      </div>
    </header>
  );
}

