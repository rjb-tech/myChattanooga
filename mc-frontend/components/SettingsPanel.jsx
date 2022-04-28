
export const SettingsPanel = ({ isDark }) => {
    return (

        <div className="w-full mx-auto">
           <ToggleSlider barBackgroundColor={ isDark===true ? "#FFF" : "#222" } />
        </div>
    )
}