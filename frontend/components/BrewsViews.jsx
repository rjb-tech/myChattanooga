import axios from "axios";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { BrewsRelease } from "./BrewsRelease";
import { useSelector, useDispatch } from "react-redux";
import { setPageContent } from "../redux/slices/mainSlice";

const loadingVariants = {
  loading: { opacity: 0 },
  loaded: { opacity: 1 },
};
// CONTENT LOADING AND SETTER TO BE TAKEN CARE OF BY RTK QUERY
export const BrewsViews = ({ isDark, currentUserMetadata }) => {
  const dispatch = useDispatch();
  const { filterApplied, pageContent } = useSelector((state) => state.main);
  var headerString = "";
  if (filterApplied === "all") {
    headerString = "All Local Releases";
  } else {
    headerString = filterApplied + " Releases";
  }

  const iconColor = "#f0f0f0";

  const headerClassString =
    contentLoading === true
      ? "text-center md:text-left font-bold text-3xl md:text-4xl z-30 text-[#222] dark:text-[#f0f0f0] animate-pulse"
      : "text-center md:text-left font-bold text-3xl md:text-4xl z-30 text-[#222] dark:text-[#f0f0f0]";

  useEffect(() => {
    const fetchData = async () => {
      setContentLoading(true);
      const result = await axios
        .get("/api/brews")
        .then((response) => {
          dispatch(setPageContent(Object.values(response.data)));
          setContentLoading(false);
        })
        .catch(function (error) {
          console.log(error);
          setContentLoading(false);
        });
    };
    fetchData();
  }, []);

  return (
    <div className="h-full w-full flex-col px-6">
      <div className="sticky w-full h-fit top-0 md:pl-2 md:mt-0 lg:mt-0 mb-2">
        <h1 className={headerClassString}>{headerString}</h1>
      </div>
      <motion.div
        className="flex-auto grid sm:grid-cols-2 xl:grid-cols-3 w-full h-fit sticky top-0 bg-[#f0f0f0] dark:bg-[#222] opacity-0"
        animate={contentLoading === true ? "loading" : "loaded"}
        transition={{
          duration: contentLoading === true ? 0 : 0.3,
          type: "tween",
        }}
        variants={loadingVariants}
      >
        {pageContent
          .filter((story) =>
            filterApplied !== "all" ? story.publisher === filterApplied : story
          )
          .map((release) => {
            const shouldShowDeleted =
              currentUserMetadata?.publisher === release.publisher;
            return (
              <div className="py-2 sm:px-2" key={release.headline}>
                <BrewsRelease
                  releaseId={release.id}
                  iconColor={iconColor}
                  publisher={release.publisher}
                  headline={release.headline}
                  datePosted={release.date_posted}
                  image={release.image_url}
                  fb={release.facebook_profile}
                  ig={release.instagram_profile}
                  showDelete={shouldShowDeleted}
                />
              </div>
            );
          })}
      </motion.div>
    </div>
  );
};