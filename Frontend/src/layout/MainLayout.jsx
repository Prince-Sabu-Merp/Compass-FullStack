import React, { useEffect, useRef, useState } from "react";
import Nav from "../components/sidebar/Nav";
import Hub from "../components/main/hub";
import Vaults from "../components/main/Vaults";
import Ledger from "../components/main/Ledger";
import Planner from "../components/main/Planner";
import Portfolio from "../components/main/Portfolio";
import Goal from "../components/main/Goal";
import Dues from "../components/main/Dues";
import TuneUp from "../components/main/TuneUp";
import PortfolioCard from "../components/cards/PortfolioCard";
import GoalChartCard from "../components/cards/GoalChartCard";

function MainLayout() {
  const [selectedNav, setSelectedNav] = useState("Hub");
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef(null);

  const toggleFullscreen = () => {
    const elem = document.documentElement;
    const isFullscreen =
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement;

    if (!isFullscreen) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleTap = (e) => {
      tapCountRef.current += 1;

      if (tapTimerRef.current) {
        clearTimeout(tapTimerRef.current);
      }

      // If 3 taps occur within 500ms, toggle fullscreen
      if (tapCountRef.current === 3) {
        toggleFullscreen();
        tapCountRef.current = 0;
        return;
      }

      // Reset counter after 500ms if not 3 taps
      tapTimerRef.current = setTimeout(() => {
        tapCountRef.current = 0;
      }, 500);
    };

    // Use touchend only for mobile precision
    document.addEventListener("touchend", handleTap, { passive: true });

    return () => {
      document.removeEventListener("touchend", handleTap);
      clearTimeout(tapTimerRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col md:flex-row h-[100dvh] touch-manipulation">
      {/* Navigation */}
      <nav className="md:sticky md:top-0 fixed bottom-0 md:relative w-full h-16 md:w-20 md:h-full lg:w-40 bg-gray-100 z-50 shadow-md">
        <Nav onItemClick={setSelectedNav} />
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-100 pb-16 md:pb-0">
        {selectedNav === "Hub" && <Hub />}
        {selectedNav === "Vaults" && <Vaults />}
        {selectedNav === "Ledger" && <Ledger />}
        {selectedNav === "Planner" && <Planner />}
        {selectedNav === "Portfolio" && <Portfolio />}
        {selectedNav === "Goal" && <Goal />}
        {selectedNav === "Dues" && <Dues />}
        {selectedNav === "TuneUp" && <TuneUp />}
      </main>
    </div>
  );
}

export default MainLayout;
