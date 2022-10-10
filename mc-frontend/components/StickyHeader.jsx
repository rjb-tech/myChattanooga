import { Logo } from "./Logo";
import { NavBar } from "./NavBar";
import { RightPanel } from "./RightPanel";
import { LeftPanel } from "./LeftPanel";
import MyChattanoogaContext from "./MyChattanoogaProvider";
import { useContext } from "react";

export const StickyHeader = ({
  menuExpanded,
  isDark,
  toggleDarkMode,
  currentWeatherLocation,
  setCurrentWeatherLocation,
  panelExpanded,
  toggleMobileNav,
  toggleMobileUserPanel,
}) => {
  return (
    <div className="flex flex-col w-full relative bg-[#f0f0f0] dark:bg-[#222] md:sticky z-[99]">
      <div className="flex flex-auto w-full h-fit content-center items-center py-4 border-b md:border-b-0">
        <LeftPanel
          toggleMobileNav={toggleMobileNav}
          isDark={isDark}
          toggleDarkMode={toggleDarkMode}
        />
        <Logo
          isDark={isDark}
          toggleMobileUserPanel={toggleMobileUserPanel}
          panelExpanded={panelExpanded}
        />
        <RightPanel
          toggleMobileUserPanel={toggleMobileUserPanel}
          toggleMobileNav={toggleMobileNav}
          isDark={isDark}
          currentWeatherLocation={currentWeatherLocation}
          setCurrentWeatherLocation={setCurrentWeatherLocation}
          menuExpanded={menuExpanded}
          panelExpanded={panelExpanded}
        />
      </div>
      <div className="hidden sm:block w-full border-y-2">
        <NavBar />
      </div>
    </div>
  );
};
