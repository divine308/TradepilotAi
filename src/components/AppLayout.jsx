
import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openSidebar = () => {
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f7f6f2] text-[#17151f]">

      {/* BACKGROUND */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(120,89,244,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(120,89,244,0.12) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        <div className="absolute left-1/2 top-[-420px] h-[700px] w-[850px] -translate-x-1/2 rounded-full bg-[#c7b7ff]/10 blur-[150px]" />
      </div>

      {/* APPLICATION SHELL */}
      <div className="relative z-10 flex min-h-screen">

        {/* SIDEBAR */}
        <Sidebar
          open={sidebarOpen}
          onClose={closeSidebar}
        />

        {/* MAIN APPLICATION AREA */}
        <div className="min-w-0 flex-1 bg-[#f7f6f2]">

          {/* TOPBAR */}
          <Topbar onMenu={openSidebar} />

          {/* PAGE CONTENT */}
          <main className="min-w-0">
            {children}
          </main>

        </div>
      </div>
    </div>
  );
}

