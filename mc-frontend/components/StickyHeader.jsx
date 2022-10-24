import { Logo } from "./Logo";
import { NavBar } from "./NavBar";
import { LeftPanel } from "./LeftPanel";
import { RightPanel } from "./RightPanel";

export const StickyHeader = () => {
  return (
    <div className="flex flex-col w-full relative bg-[#f0f0f0] dark:bg-[#222] md:sticky z-[99]">
      <div className="flex flex-auto w-full h-fit content-center items-center py-4 border-b md:border-b-0">
        <LeftPanel />
        <Logo />
        <RightPanel />
      </div>
      <div className="hidden sm:block w-full border-y-2">
        <NavBar />
      </div>
    </div>
  );
};
