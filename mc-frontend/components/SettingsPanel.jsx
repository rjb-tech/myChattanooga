export const SettingsPanel = ({ isDark }) => {
    const sliderClassString = isDark===true ? "ui inverted slider checkbox" : "ui slider checkbox"
    return (

        <div className="w-full mx-auto">
            <div className={sliderClassString}>
                IDK what to put here yet. Maybe this can be where you create new content if you have access to the brews feature
            </div>
        </div>
    )
}