import { useEffect, useState } from "react"
import { Article } from "../components/Article"
import { motion } from "framer-motion"
import MyChattanoogaContext from "../components/MyChattanoogaProvider"
import { useContext } from "react"

export default function Home(pageProps) {
  const [ articles, setArticles ] = useState(() => []);
  const [articlesLoading, setArticlesLoading ] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch('/api/articles')
        .then(async (response) => {
          const data = await response.json();
          setArticles(Object.values(data));
        })

    };
    setArticlesLoading(articlesLoading => !articlesLoading)
    fetchData();
    setArticlesLoading(articlesLoading => !articlesLoading)
  }, [])

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
          <h1 className="text-center md:text-left font-bold text-3xl md:text-4xl z-30">All Local Articles</h1>
        </div>
        
        <div className="flex-auto grid bg-white sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4 w-full h-fit z-auto sticky top-0">
          {articles.map((story) => {
            return (
              <div className="py-2 md:px-2" key={story.headline}>
                <Article 
                  headline={story.headline}
                  timePosted={story.time_posted}
                  publisher={story.publisher}
                  image={story.image} 
                  link={story.link}
                />
              </div>
            )  
          })} 

        </div>
      </div>
    </div>
  )
}
