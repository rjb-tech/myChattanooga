import axios from "axios";
import { StatGraph } from "../components/StatGraph";
import formatISO from "date-fns/formatISO";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function stats({ filterApplied }) {
  const { isLoading, isError, isSuccess, data } = useQuery(
    ["stats"],
    async () => {
      const { data } = await axios.get("/api/stats");
      return data;
    }
  );

  const MODES = {
    1: {
      name: "Today's Stats",
    },
    2: {
      name: "Stats over the last 7 days",
    },
  };

  const [mode, setMode] = useState(MODES[1]);
  const [header, setHeader] = useState("All Publisher Stats");
  const todayISO = formatISO(new Date(), { representation: "date" });
  // rawChartData will need to be filtered based on selected mode (daily or weekly stats)
  const rawChartData =
    data !== undefined && data.length > 0
      ? data?.filter((entry) => entry.date_saved === todayISO)
      : [];
  const labels = [...new Set(rawChartData?.map((entry) => entry.publisher))];
  const formattedChartData = labels.map((currentPublisher) => {
    return {
      publisher: currentPublisher,
      scraped: rawChartData
        ?.filter((entry) => entry.publisher === currentPublisher)
        .reduce((prev, current) => prev + current.scraped, 0),
      relevant: rawChartData
        ?.filter((entry) => entry.publisher === currentPublisher)
        .reduce((prev, current) => prev + current.relevant, 0),
    };
  });

  useEffect(() => {
    console.log(formattedChartData);
    console.log("^^ chart data ^^");
  }, [formattedChartData]);

  useEffect(() => {
    if (isError) setHeader("Error fetching stats");
    else {
      if (filterApplied === "all") setHeader("All Publisher Stats");
      else setHeader(`${filterApplied} Stats`);
    }
  }, [isError, filterApplied]);

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
        <div className="w-full mx-auto h-[38rem] md:h-[30rem] pt-8 z-20">
          {formattedChartData.length > 0 && (
            <StatGraph data={formattedChartData} />
          )}
        </div>
      </div>
    </div>
  );
}