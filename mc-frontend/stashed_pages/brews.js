import { useEffect } from "react";
import { useRouter } from "next/router";
import { BrewsViews } from "../components/BrewsViews";
import { CreateBrews } from "../components/CreateBrews";

// MOVE THIS BACK TO THE PAGES DIRECTORY WHEN/IF IT IS EVER USED

export default function Brews({
  isDark,
  pageContent,
  setPageContent,
  currentPage,
  setCurrentPage,
  contentLoading,
  setContentLoading,
  currentUserMetadata,
  setCurrentUserMetadata,
}) {
  useEffect(() => {
    setCurrentPage("/brews");
  }, []);

  const router = useRouter();
  const { view } = router.query;

  const publicBrews = view === "" || view === undefined;
  const refreshedBrews = view === "refresh";
  const create = view === "create";
  const privateBrews = view === "mine";

  return (
    <div className="dark:text-white mx-auto w-full">
      {publicBrews && (
        <BrewsViews
          isDark={isDark}
          setPageContent={setPageContent}
          pageContent={pageContent}
          contentLoading={contentLoading}
          setContentLoading={setContentLoading}
          currentUserMetadata={currentUserMetadata}
        />
      )}
      {/* This gives me a refresh state to use after submitting a brews release and prevents page flashing */}
      {refreshedBrews && (
        <BrewsViews
          isDark={isDark}
          setPageContent={setPageContent}
          pageContent={pageContent}
          contentLoading={contentLoading}
          setContentLoading={setContentLoading}
          currentUserMetadata={currentUserMetadata}
        />
      )}
      {create && <CreateBrews />}
      {/* {privateBrews && <MyBrews publisher="{ }" expired />} */}
    </div>
  );
}
