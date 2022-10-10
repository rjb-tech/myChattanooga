import { Logo } from "./Logo";
import { NavBar } from "./NavBar";
import { RightPanel } from "./RightPanel";
import { LeftPanel } from "./LeftPanel";

export const StickyHeader = ({
  isDark,
  currentWeatherLocation,
  setCurrentWeatherLocation,
}) => {
  return (
    <div className="flex flex-col w-full relative bg-[#f0f0f0] dark:bg-[#222] md:sticky z-[99]">
      <div className="flex flex-auto w-full h-fit content-center items-center py-4 border-b md:border-b-0">
        <LeftPanel isDark={isDark} />
        <Logo isDark={isDark} />
        <RightPanel
          isDark={isDark}
          currentWeatherLocation={currentWeatherLocation}
          setCurrentWeatherLocation={setCurrentWeatherLocation}
        />
      </div>
      <div className="hidden sm:block w-full border-y-2">
        <NavBar />
      </div>
    </div>
  );
};
