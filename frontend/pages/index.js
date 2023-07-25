import formatISO from "date-fns/formatISO";
import { useEffect, useState } from "react";
import { Article } from "../components/Article";
import { useSelector, useDispatch } from "react-redux";
import { isFromTheFuture } from "../components/helpers";
import { setPageContent } from "../redux/slices/mainSlice";
import { useGetArticlesByDateQuery } from "../redux/services/articlesService";

export default function Home() {
  const dispatch = useDispatch();
  const { filterApplied, pageContent, currentDate } = useSelector(
    (state) => state.main
  );
  const { data, error, isLoading } = useGetArticlesByDateQuery(currentDate);

  const [header, setHeader] = useState("All Local Articles");

  const todayISO = formatISO(new Date(), { representation: "date" });
  const currentIsToday = currentDate === todayISO;

  useEffect(() => {
    if (filterApplied === "all") setHeader("All Local Articles");
    else setHeader(`${filterApplied} Articles`);
  }, [filterApplied]);

  useEffect(() => {
    if (!isLoading && !error && data !== undefined) {
      // this shit right here needs editing
      const ISOdate = formatISO(new Date(), { representation: "date" });
      const filteredData = data?.filter((entry) => {
        return currentIsToday
          ? !isFromTheFuture(entry.time_posted) && entry.date_saved === ISOdate
          : entry.date_saved === currentDate;
      });
      dispatch(setPageContent(data));
    }
  }, [data]);

  let headerClass = "";
  if (error === true)
    headerClass =
      "text-center md:text-left font-bold text-3xl md:text-4xl z-30 text-red-500";
  else {
    if (isLoading === true)
      headerClass =
        "text-center md:text-left font-bold text-3xl md:text-4xl z-30 text-[#222] dark:text-[#f0f0f0] py-3 animate-pulse";
    else
      headerClass =
        "text-center md:text-left font-bold text-3xl md:text-4xl z-30 text-[#222] dark:text-[#f0f0f0] py-3";
  }

  return (
    <div className="mx-auto">
      <div className="h-full w-full flex-col px-6">
        <div className="sticky w-full h-fit top-0 md:pl-2 md:mt-0 lg:mt-0 mb-2">
          <h1 className={headerClass}>{header}</h1>
        </div>

        <div className="flex-auto grid sm:grid-cols-2 xl:grid-cols-3 w-full h-fit sticky top-0 bg-[#f0f0f0] dark:bg-[#222]">
          {pageContent
            ?.filter((story) =>
              filterApplied !== "all"
                ? story.publisher === filterApplied
                : story
            )
            ?.map((story) => {
              return (
                <div className="py-2 sm:px-2" key={story.headline}>
                  <Article
                    headline={story.headline}
                    timePosted={story.published}
                    publisher={story.publisher}
                    image={story.image}
                    link={story.link}
                  />
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
