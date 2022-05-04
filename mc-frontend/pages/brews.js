import { useEffect } from "react"

export default function Brews({ filtersApplied, setFiltersApplied, toggleMobileUserPanel, setCurrentPage }) {
  useEffect(() => {
    setCurrentPage(window.location.pathname);
  })
  return (
    <div>
      HI MOM
    </div>
  )
}