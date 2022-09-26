import { useEffect, useState } from "react";
import { Article } from "../components/Article";
import formatISO from "date-fns/formatISO";
import { isFromTheFuture } from "../components/helpers";
import { useQuery } from "@tanstack/react-query";
const axios = require("axios");

export default function Home({ filterApplied, pageContent, setPageContent }) {
  const { isLoading, isError, data } = useQuery(["articles"], async () => {
    const { data } = await axios.get("/api/articles");
    return data;
  });

  const [header, setHeader] = useState("All Local Articles");

  useEffect(() => {
    if (isError) setHeader("Error fetching articles");
    else {
      if (filterApplied === "all") setHeader("All Local Articles");
      else setHeader(`${filterApplied} Articles`);
    }
  }, [isError, filterApplied]);

  useEffect(() => {
    if (!isLoading && !isError && data !== undefined) {
      const ISOdate = formatISO(new Date(), { representation: "date" });
      setPageContent(
        data.filter((entry) => {
          !isFromTheFuture(entry.time_posted) && entry.date_saved === ISOdate;
        })
      );
    }
  }, [data]);

  let headerClass = "";
  if (isError === true)
    headerClass =
      "text-center md:text-left font-bold text-3xl md:text-4xl z-30 text-red-500";
  else {
    if (isLoading === true)
      headerClass =
        "text-center md:text-left font-bold text-3xl md:text-4xl z-30 text-[#222] dark:text-[#f0f0f0] animate-pulse";
    else
      headerClass =
        "text-center md:text-left font-bold text-3xl md:text-4xl z-30 text-[#222] dark:text-[#f0f0f0]";
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
                    timePosted={story.time_posted}
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
