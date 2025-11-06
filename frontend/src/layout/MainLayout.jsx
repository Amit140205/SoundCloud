import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../components/ui/resizable";
import LeftSideBar from "./components/LeftSideBar";
import FriendsActivity from "./components/FriendsActivity";
import AudioPlayer from "./components/AudioPlayer";
import PlayBackControls from "./components/PlayBackControls";

function MainLayout() {
  const [isMobile, setMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setMobile(window.innerWidth < 768);
    };

    checkMobile();

    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  return (
    <div className="h-screen bg-black text-white flex flex-col">
      {/* putting audio */}
      <AudioPlayer />

      <ResizablePanelGroup
        direction="horizontal"
        className="flex-1 flex h-full overflow-hidden p-2"
      >
        {/* left sidebar */}
        <ResizablePanel
          defaultSize={20}
          minSize={isMobile ? 0 : 10}
          maxSize={30}
        >
          <LeftSideBar />
        </ResizablePanel>

        {/* handle resizing */}
        <ResizableHandle className="w-2 bg-black rounded-lg transition-colors" />

        {/* main content */}
        <ResizablePanel>
          <Outlet />
        </ResizablePanel>

        {!isMobile && (
          <>
            {/* handle resizing */}
            <ResizableHandle className="w-2 bg-black rounded-lg transition-colors" />

            {/* right sidebar */}
            <ResizablePanel
              defaultSize={20}
              minSize={0}
              maxSize={25}
              collapsedSize={0}
            >
              {/* Right Sidebar = friends activity */}
              <FriendsActivity />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>

      <PlayBackControls />
    </div>
  );
}

export default MainLayout;
