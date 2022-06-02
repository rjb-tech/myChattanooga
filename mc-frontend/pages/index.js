import { useEffect, useState } from "react"
import { motion } from "framer-motion";
import { Article } from "../components/Article"
import { isFromTheFuture } from "../components/helpers";
const axios = require('axios');

const loadingVariants = {
  loading: {opacity: 0},
  loaded: {opacity: 1}
}

export default function Home({ 
  filterApplied, 
  pageContent, 
  setPageContent,
  currentPage, 
  setCurrentPage,
  contentLoading,
  setContentLoading
}) {

  useEffect(() => {
    const fetchData = async () => {
      setContentLoading(true);
      const result = await axios.get('/api/articles')
        .then((response) => {
          const data = response.data;
          setPageContent(Object.values(data));
          setContentLoading(false);
        })
        .catch(function (error) {
          console.log(error);
          setContentLoading(false);
        })
    }
    setCurrentPage(window.location.pathname);
    fetchData();
  }, [])

  var headlineString = ""
  if (filterApplied === "all") {
    headlineString = "All Local Articles"
  }
  else {
    headlineString = filterApplied + " Articles"
  }


  return (
    <div className="mx-auto">
      <div className="h-full w-full flex-col px-6">
        <div className="sticky w-full h-fit top-0 md:pl-2 md:mt-0 lg:mt-0 mb-2">
          <h1 className="text-center md:text-left font-bold text-3xl md:text-4xl z-30 text-[#222] dark:text-[#FFF]">{headlineString}</h1>
        </div>
        
        <motion.div 
          className="flex-auto grid sm:grid-cols-2 xl:grid-cols-3 w-full h-fit sticky top-0 bg-[#FFF] dark:bg-[#222] opacity-0"
          animate={contentLoading===true ? "loading" : "loaded"}
          transition={{ 
            duration: contentLoading===true ? 0 : .3, 
            type: "tween"
          }}
          variants={loadingVariants}
        >
          {pageContent.map((story) => {
            if (!isFromTheFuture(story.time_posted)) {  
              if (filterApplied === "all") {
                return (
                  <div className="py-2 sm:px-2" key={story.headline}>
                    <Article 
                      headline={story.headline}
                      timePosted={story.time_posted}
                      publisher={story.publisher}
                      image={story.image} 
                      link={story.link}
                    />
                  </div>
                )
              }
              else {
                if (story.publisher === filterApplied) {
                  return (
                    <div className="py-2 sm:px-2" key={story.headline}>
                      <Article 
                        headline={story.headline}
                        timePosted={story.time_posted}
                        publisher={story.publisher}
                        image={story.image} 
                        link={story.link}
                      />
                    </div>
                  )
                }
              }
            }
          })} 
        </motion.div>
      </div>
    </div>
  )
}
