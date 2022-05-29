import { useEffect } from "react"

// Hide filters here
export default function Faq({ 
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
    return (
      <div className="mx-auto">
        <div className="h-full w-full flex-col px-6">
          <div className="sticky w-full h-fit top-0 md:pl-2 md:mt-0 lg:mt-0 mb-2">
            <h1 className="text-center md:text-left font-bold text-3xl md:text-4xl z-30 text-[#222] dark:text-[#FFF]">FAQ</h1>
          </div>
        </div>
      </div>
    )
}