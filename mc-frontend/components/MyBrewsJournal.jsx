export const MyBrewsJournal = ({ brews }) => {
  return (
    <div className="flex-col w-4/6 mx-auto">
      <div className="sticky w-full h-fit top-0 md:pl-2 md:mt-0 lg:mt-0 mb-2">
        <h3 
          className="aux-panel-header text-center md:text-left font-bold text-3xl md:text-2xl z-30 text-[#222] dark:text-[#FFF]"
        >
          My Brews
        </h3>
      </div>
      {brews.map((release) => {
        return (
          <div className="flex-auto mx-auto border py-2 rounded-lg md:rounded-full w-full hover:ring-1 hover:ring-[#F7BCB1]">
            <div>
            </div>
          </div>
        )
      })}
    </div>
  )    
}