import { useEffect, useState } from "react"
import { Article } from "../components/Article"
import { motion } from "framer-motion"
import MyChattanoogaContext from "../components/MyChattanoogaProvider";
import { useContext } from "react";
import { WeatherStation } from "../components/WeatherStation";
import { UserPanel } from "../components/UserPanel";
import { Socials } from "../components/Socials";
const axios = require('axios');

export default function Home({ 
  filterApplied, 
  setFilterApplied,
  toggleMobileUserPanel, 
  pageContent, 
  setPageContent, 
  isDark, 
  toggleDarkMode,
  filterOptions,
  setFilterOptions,
  currentPage,
  setCurrentPage
}) {
  const [ articles, setArticles ] = useState([]);
  const [ articlesLoading, setArticlesLoading ] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get('/api/articles')
        .then((response) => {
          const data = response.data;
          setPageContent(Object.values(data));
        })
        .catch(function (error) {
          console.log(error)
        })
    }
    setCurrentPage(window.location.pathname);
    setArticlesLoading(true);
    fetchData();
    setArticlesLoading(false);
  }, [])

  useEffect(() => {
    const publishers = [...new Set(pageContent.map((contentItem) => contentItem.publisher))].sort();
    setFilterOptions(publishers);
  }, [pageContent])

  var headlineString = ""
  if (filterApplied === "all") {
    headlineString = "All Local Articles"
  }
  else {
    headlineString = filterApplied + " Articles"
  }


  return (
    <div className="flex mx-auto">
      <div className="hidden flex-col md:block md:h-fit w-4/12 md:w-5/12 xl:w-2/12 flex-auto border-r-2 sticky top-8 pr-2">
        <UserPanel 
          isDark={isDark} 
          toggleDarkMode={toggleDarkMode}  
          filterOptions={filterOptions}
          filterApplied={filterApplied}
          setFilterApplied={setFilterApplied}
        />
      </div>

      <div className="h-full w-full flex-col px-6">
        <div className="sticky w-full h-fit top-0 md:pl-2 md:mt-4 lg:mt-0 mb-2">
          <h1 className="text-center md:text-left font-bold text-3xl md:text-4xl z-30 text-[#222] dark:text-[#FFF]">{headlineString}</h1>
        </div>
        
        <div className="flex-auto grid sm:grid-cols-2 xl:grid-cols-3 w-full h-fit z-auto sticky top-0 bg-[#FFF] dark:bg-[#222]">
          {pageContent.map((story) => {
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
          })} 
        </div>
      </div>
    </div>
  )
}
