import { BrewsRelease } from "./BrewsRelease"
import { useEffect } from "react"
import { motion } from "framer-motion"
import axios from "axios"

const loadingVariants = {
  loading: { opacity: 0 },
  loaded: { opacity: 1 }
}

export const BrewsViews = ({
  setPageContent,
  pageContent,
  contentLoading,
  setContentLoading,
  filterApplied
}) => {
  const headerClassString = contentLoading === true ? "text-center md:text-left font-bold text-3xl md:text-4xl z-30 text-[#222] dark:text-[#FFF] animate-pulse" : "text-center md:text-left font-bold text-3xl md:text-4xl z-30 text-[#222] dark:text-[#FFF]"
  useEffect(() => {
    const fetchData = async () => {
      setContentLoading(true);
      const result = await axios.get('/api/brews')
        .then((response) => {
          setPageContent(Object.values(response.data));
          setContentLoading(false);
        })
        .catch(function (error) {
          console.log(error);
          setContentLoading(false);
        })
    }
    // setCurrentPage(window.location.pathname);
    fetchData();
  }, [])

  return (
    <div>
      <div className="sticky w-full h-fit top-0 md:pl-2 md:mt-0 lg:mt-0 mb-2">
        <h1 className={headerClassString}>Brews Releases</h1>
      </div>
      <motion.div
        className="flex-auto grid sm:grid-cols-2 xl:grid-cols-3 w-full h-fit sticky top-0 bg-[#FFF] dark:bg-[#222] opacity-0"
        animate={contentLoading === true ? "loading" : "loaded"}
        transition={{
          duration: contentLoading === true ? 0 : .3,
          type: "tween"
        }}
        variants={loadingVariants}
      >
        {pageContent
          // .filter((story) => filterApplied !== "all" ? story.publisher === filterApplied : story.publisher === story.publisher)
          .map((story) => {
            return (
              <div className="py-2 sm:px-2" key={story.headline}>
                <BrewsRelease
                  publisher={story.publisher}
                  headline={story.headline}
                  datePosted={story.date_posted}
                // image={image}
                />
              </div>
            )
          })
        }
      </motion.div>
    </div>
  )
} 