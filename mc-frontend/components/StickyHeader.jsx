import { Logo } from "./Logo"
import { NavBar } from "./NavBar"
import { RightPanel } from "./RightPanel"
import { LeftPanel } from "./LeftPanel"
import { TimeClock } from "./TimeClock"
import { UserPanel } from "./UserPanel"
import MyChattanoogaContext from './MyChattanoogaProvider'
import { useContext } from "react"

export const StickyHeader = ({ isDark }) => {
    const { isExpanded, toggleMenu } = useContext(MyChattanoogaContext);
    return (
        <div className="flex flex-col w-full">
            
            <div className="flex flex-auto w-full h-fit lg:h-fit content-center border-b-2">
                <LeftPanel />
                <Logo {...isDark} />
                <RightPanel {...toggleMenu} />
            </div>
            <div className="hidden sm:block w-full border-b-2">
                <NavBar />
            </div>
            
        </div>
    )
}