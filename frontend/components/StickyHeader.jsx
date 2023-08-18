import { Logo } from "./Logo";
import { NavBar } from "./NavBar";
import { LeftPanel } from "./LeftPanel";
import { RightPanel } from "./RightPanel";

export const StickyHeader = () => {
  return (
    <div className="flex flex-col w-full relative bg-[#f0f0f0] dark:bg-[#222] md:sticky z-[99]">
      <div className="flex flex-auto w-full h-fit content-center items-center py-4 border-b border-b-[#1f1f1f]/[0.1] dark:border-b-[#FFFFFF]/[0.1]">
        <LeftPanel />
        <Logo />
        <RightPanel />
      </div>
    </div>
  );
};
