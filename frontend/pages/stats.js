import { useSelector } from "react-redux";
import formatISO from "date-fns/formatISO";
import { useEffect, useState } from "react";
import { BarGraph } from "../components/BarGraph";
import { PieStatChart } from "../components/PieChart";
import { useGetStatsByDateQuery } from "../redux/services/statsService";

export default function Stats() {
  const { filterApplied, currentDate } = useSelector((state) => state.main);
  const { isLoading, data, error } = useGetStatsByDateQuery(currentDate);

  const MODES = {
    1: {
      name: "Today's Stats",
    },
    2: {
      name: "Stats over the last 7 days",
    },
  };

  const [header, setHeader] = useState("All Publisher Stats");
  const todayISO = formatISO(new Date(), { representation: "date" });
  // rawChartData will need to be filtered based on selected mode (daily or weekly stats)
  const rawChartData =
    data !== undefined && data.length > 0
      ? data?.filter((entry) =>
          currentDate === todayISO ? entry.date_saved === todayISO : entry
        )
      : [];
  const labels = [...new Set(rawChartData?.map((entry) => entry.publisher))];
  const barChartData = labels.map((currentPublisher) => {
    return {
      publisher: currentPublisher,
      Posted: rawChartData
        ?.filter((entry) => entry.publisher === currentPublisher)
        .reduce((prev, current) => prev + current.scraped, 0),
      Relevant: rawChartData
        ?.filter((entry) => entry.publisher === currentPublisher)
        .reduce((prev, current) => prev + current.relevant, 0),
    };
  });
  const pieChartData = [
    {
      name: "Posted",
      value: rawChartData.reduce((prev, current) => prev + current.scraped, 0),
    },
    {
      name: "Relevant",
      value: rawChartData.reduce((prev, current) => prev + current.relevant, 0),
    },
  ];

  useEffect(() => {
    if (filterApplied === "all") setHeader("All Publisher Stats");
    else setHeader(`${filterApplied} Stats`);
  }, [filterApplied]);

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
        <div className="sticky top-0 w-full h-fit md:pl-2 md:mt-0 lg:mt-0 bg-[#f0f0f0] dark:bg-[#222] z-50">
          <h1 className={headerClass}>{header}</h1>
        </div>
        <div className="pb-20">
          <div className="relative w-full mx-auto h-[38rem] md:h-[28rem] mt-12">
            {barChartData.length > 0 && <BarGraph data={barChartData} />}
          </div>
          <div className="relative w-full md:w-1/3 mx-auto h-[28rem] pt-20 mx-auto mt-20">
            {pieChartData.length > 0 && <PieStatChart data={pieChartData} />}
          </div>
        </div>
      </div>
    </div>
  );
}