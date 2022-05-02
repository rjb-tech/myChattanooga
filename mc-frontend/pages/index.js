import { useEffect, useState } from "react"
import { Article } from "../components/Article"
import { motion } from "framer-motion"
import MyChattanoogaContext from "../components/MyChattanoogaProvider";
import { useContext } from "react";
const axios = require('axios');

export default function Home({ filterApplied, toggleMobileUserPanel, pageContent, setPageContent }) {
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
    };
    setArticlesLoading(true);
    fetchData();
    setArticlesLoading(false);
  }, [])

  var headlineString = ""
  if (filterApplied === "all") {
    headlineString = "All Local Articles"
  }
  else {
    headlineString = filterApplied + " Articles"
  }


  return (
    <div className="flex mx-auto">
      <div className="hidden md:block md:h-fit w-4/12 lg:w-2/12 flex-auto md:mr-2 lg:mr-4 border-r-2 sticky top-8">
        <p className="pr-8 sticky top-0">
          Make this the UserPanel component and import and such. should be sticky and only show on medium screen and up.
          Otherwise the left panel up top will be the toggle for the menu. Do fancy borders and outlines next. Make it look nice
        </p>
      </div>

      <div className="h-full w-full flex-col px-6">
        <div className="sticky w-full h-fit top-0 md:pl-2 mb-2 md:mb-6">
          <h1 className="text-center md:text-left font-bold text-3xl md:text-4xl z-30 text-[#222] dark:text-[#FFF]">{headlineString}</h1>
        </div>
        
        <div className="flex-auto grid sm:grid-cols-2 xl:grid-cols-4 w-full h-fit z-auto sticky top-0 bg-[#FFF] dark:bg-[#222]">
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
