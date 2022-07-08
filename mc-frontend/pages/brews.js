import { useEffect } from "react"
import { useRouter } from "next/router"
import { BrewsViews } from "../components/BrewsViews";

export default function Brews({
  filterApplied,
  pageContent,
  setPageContent,
  currentPage,
  setCurrentPage,
  contentLoading,
  setContentLoading
}) {
  useEffect(() => {
    setCurrentPage(window.location.pathname);
  }, [])

  const router = useRouter()
  const { view } = router.query

  const publicBrews = view === "" || view === undefined
  const create = view === "create"
  const privateBrews = view === "mine"

  return (
    <div className="dark:text-white">
      {publicBrews &&
        <BrewsViews
          setPageContent={setPageContent}
          pageContent={pageContent}
          contentLoading={contentLoading}
          setContentLoading={setContentLoading}
          filterApplied={filterApplied}
        />}
      {/* {create && <CreateBrew />}
      {privateBrews && <MyBrews publisher="{ }" expired />} */}
    </div>
  )
}