import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons"
import { motion } from "framer-motion"

export const MyBrewsJournal = ({ brews }) => {
  return (
    <div className="flex-col w-5/6 mx-auto h-80">
      <div className="sticky w-full h-fit top-0 md:pl-2 md:mt-0 lg:mt-0 mb-2 bg-[#FFF] dark:bg-[#222] pb-4 z-50">
        <h3 
          className="aux-panel-header text-center md:text-left font-bold text-3xl md:text-2xl z-30 text-[#222] dark:text-[#FFF]"
        >
          My Brews
        </h3>
      </div>
      {brews.map((release) => {
        return (
          <div className="py-2">
            <div className="flex mx-auto rounded-lg py-2 w-full border-x-2 border-[#222] dark:border-[#fff]">
              <div className="px-4 py-2 w-4/6">
                {`${release.headline}`}
              </div>
              <div className="flex-auto w-2/6 flex justify-between">
                <motion.button 
                  whileTap={{ scale: 0.85 }} 
                  className='flex-auto bg-[#FFF] dark:bg-[#222] w-1/3 rounded-full z-10'
                  // onClick={() => {handleAuxPanel("account")}}
                >
                  <FontAwesomeIcon className='flex-auto w-5/12 mx-auto' icon={faPencil}/>
                </motion.button>
                <motion.button 
                  whileTap={{ scale: 0.85 }} 
                  className='flex-auto bg-[#FFF] dark:bg-[#222] w-1/3 rounded-full z-10'
                  // onClick={() => {handleAuxPanel("account")}}
                >
                  <FontAwesomeIcon className='flex-auto w-4/12 mx-auto' icon={faTrash}/>
                </motion.button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )    
}