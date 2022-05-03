import { Logo } from "./Logo"
import { NavBar } from "./NavBar"
import { RightPanel } from "./RightPanel"
import { LeftPanel } from "./LeftPanel"
import { TimeClock } from "./TimeClock"
import MyChattanoogaContext from './MyChattanoogaProvider'
import { useContext } from "react"

export const StickyHeader = ({ isDark }) => {
    const { toggleMobileNav, toggleMobileUserPanel } = useContext(MyChattanoogaContext);
    return (
        <div className="flex flex-col w-full md:sticky">
            
            <div className="flex flex-auto w-full h-fit content-center items-center py-4">
                <LeftPanel {...toggleMobileNav} isDark={isDark} />
                <Logo isDark={isDark} />
                <RightPanel {...toggleMobileUserPanel} isDark={isDark} />
            </div>
            <div className="hidden sm:block w-full">
                <NavBar />
            </div>
            
        </div>
    )
}