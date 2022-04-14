import { Logo } from "./Logo"
import { NavBar } from "./NavBar"
import { DailyInfo } from "./DailyInfo"
import { ProfileExplorer } from "./ProfileExplorer"
import { TimeClock } from "./TimeClock"
import { UserPanel } from "./UserPanel"
import MyChattanoogaContext from './MyChattanoogaProvider'
import { useContext } from "react"

export const StickyHeader = ({ isDark }) => {
    const { isExpanded, toggleMenu } = useContext(MyChattanoogaContext);
    return (
        <div className="flex flex-col w-full">
            
            <div className="flex flex-auto w-full h-fit lg:h-fit content-center">
                <ProfileExplorer />
                <Logo {...isDark} />
                <DailyInfo {...toggleMenu} />
            </div>
            <div className="hidden sm:block w-full">
                <NavBar />
            </div>
            
        </div>
    )
}