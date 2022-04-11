import { Logo } from "./Logo"
import { NavBar } from "./NavBar"

export const StickyHeader = (props) => {
    return (
        <div className="flex w-screen h-max">
            {/* This will leverage the next js Image component */}
            
            <div className="inline-flex w-2/3 h-max bg-yellow-300" style={{position: 'relative'}}>
                <Logo isDark={ props.isDark } />
                LOGO
            </div>
            <div className="inline-flex w-2/3 h-max bg-blue-500">
                <NavBar />
            </div>
            
        </div>
    )
}