import { useEffect } from "react";
import { useRouter } from "next/router";
import { BrewsViews } from "../components/BrewsViews";
import { CreateBrews } from "../components/CreateBrews";

export default function Brews({
  filterApplied,
  pageContent,
  setPageContent,
  currentPage,
  setCurrentPage,
  contentLoading,
  setContentLoading,
}) {
  useEffect(() => {
    setCurrentPage("/brews");
  }, []);

  const router = useRouter();
  const { view } = router.query;

  const publicBrews = view === "" || view === undefined;
  const create = view === "create";
  const privateBrews = view === "mine";

  return (
    <div className="dark:text-white">
      {publicBrews && (
        <BrewsViews
          setPageContent={setPageContent}
          pageContent={pageContent}
          contentLoading={contentLoading}
          setContentLoading={setContentLoading}
          filterApplied={filterApplied}
        />
      )}
      {create && <CreateBrews />}
      {/* {privateBrews && <MyBrews publisher="{ }" expired />} */}
    </div>
  );
}
