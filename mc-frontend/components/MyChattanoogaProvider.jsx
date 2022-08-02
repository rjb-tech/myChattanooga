import { StickyHeader } from "./StickyHeader"
import Head from 'next/head'
import { useState, createContext, useRef, useEffect, cloneElement } from "react"
import { MobileNav } from "./MobileNav"
import { MobileUserPanel } from "./MobileUserPanel"
import { motion } from "framer-motion"
import { UserPanel } from "./UserPanel"
import { faChevronUp } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useRouter } from "next/router"

const MyChattanoogaContext = createContext();

const childrenComponentVariants = {
  normal: { y: "0%" },
  extended: { y: "5rem" }
}

const userPanelVariants = {
  open: { opacity: 1, y: "0%" },
  closed: { opacity: 0, y: "-100%" },
}

const scrollTopButtonVariants = {
  visible: { opacity: .7 },
  closed: { opacity: 0 }
}

export const MyChattanoogaProvider = ({ children }) => {

  const useDarkModePreference = () => {
    useEffect(() => {
      const isDarkMode = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDark(isDarkMode);
      // if (isDark===true && !document.body.classList.contains('dark')) {document.body.classList.add("dark")}
    }, [])
  }

  const useWeatherLocation = () => {
    useEffect(() => {
      const lsWeatherLocation = localStorage.getItem('weatherLocation')
      if (lsWeatherLocation && lsWeatherLocation !== "undefined") {
        setCurrentWeatherLocation(lsWeatherLocation)
      }
      else {
        setCurrentWeatherLocation("northChattanooga")
        localStorage.setItem('weatherLocation', 'northChattanooga')
      }
    }, [])
  }

  const router = useRouter();
  const [isDark, setDark] = useState(useDarkModePreference());
  const [currentWeatherLocation, setCurrentWeatherLocation] = useState(useWeatherLocation());
  const [menuExpanded, setMenuExpanded] = useState(false);
  const [panelExpanded, setPanelExpanded] = useState(false);
  const [settingsPanelExpanded, setSettingsPanelExpanded] = useState(false);
  const [auxPanelExpanded, setAuxPanelExpanded] = useState(false);
  const [filterApplied, setFilterApplied] = useState("all");
  const [pageContent, setPageContent] = useState([]);
  const [contentLoading, setContentLoading] = useState(true);
  const [filterOptions, setFilterOptions] = useState([]);
  const [currentPage, setCurrentPage] = useState("");
  const [currentAuxSection, setCurrentAuxSection] = useState("");
  const [showTopButton, setShowTopButton] = useState(false);
  const [ previousFilter, setPreviousFilter ] = useState("");

  const showFilters = 
    (currentPage === '/' || currentPage === '/brews') 
    && router.query.view !== "create" 
    && pageContent.length > 0

  function toggleMobileNav() {
    setMenuExpanded(menuExpanded => !menuExpanded);
  }
  function toggleMobileUserPanel() {
    if (auxPanelExpanded === true) {
      setAuxPanelExpanded(auxPanelExpanded => !auxPanelExpanded);
      setTimeout(function () {
        setPanelExpanded(panelExpanded => !panelExpanded)
        setCurrentAuxSection("")
      }, 150);
    }
    else {
      setPanelExpanded(panelExpanded => !panelExpanded);
    }
  }

  function toggleDarkMode() {
    setDark(isDark => !isDark)
    localStorage.setItem("dark", isDark)
  }

  const value = {
    isExpanded: { menuExpanded },
    toggleMobileNav: { toggleMobileNav },
    panelExpanded: { panelExpanded },
    toggleMobileUserPanel: { toggleMobileUserPanel },
    toggleDarkMode: { toggleDarkMode },
    settingsPanelExpanded: { settingsPanelExpanded },
    setSettingsPanelExpanded: { setSettingsPanelExpanded },
    auxPanelExpanded: { auxPanelExpanded },
    setAuxPanelExpanded: { setAuxPanelExpanded },
    filterApplied: { filterApplied },
    setFilterApplied: { setFilterApplied }
  }

  useEffect(() => {
    const publishers = [...new Set(pageContent.map((contentItem) => contentItem.publisher))].sort();
    setFilterOptions(publishers);
  }, [pageContent])

  useEffect(() => {
    localStorage.setItem("weatherLocation", currentWeatherLocation)
  }, [currentWeatherLocation])

  useEffect(() => {
    localStorage.setItem("dark", isDark)
    !document.body.classList.contains('dark') && isDark === true
      ? (document.body.classList.add("dark"))
      : (document.body.classList.remove("dark"))
  }, [isDark])

  // Scroll window to top on page change
  // USE THIS ELEMENT FOR SCROLL TO TOP BUTTON
  useEffect(() => {
    const element = document.getElementById("content")
    element.scrollTop = 0
    setFilterApplied("all")
  }, [currentPage])

  // https://www.kindacode.com/article/how-to-create-a-scroll-to-top-button-in-react/
  useEffect(() => {
    const element = document.getElementById("content")
    const handleScroll = (scrollAmount) => {
      const element = document.getElementById("content")
      if (element.scrollTop > 200) {
        setShowTopButton(true);
      } else {
        setShowTopButton(false);
      }
    }
    element.addEventListener("scroll", () => {
      handleScroll(element.scrollTop)
    });
  }, []);

  const scrollToTop = () => {
    const element = document.getElementById("content")
    element.scrollTo({
      top: 0,
      behavior: 'smooth' // for smoothly scrolling
    });
  };

  const childrenWrapperClassString = (menuExpanded === true)
    ? "overscroll-contain transition duration-[300ms] blur-sm ease-linear relative"
    : "overscroll-contain transition duration-[300ms] relative"

  return (
    <MyChattanoogaContext.Provider value={value}>
      <div className="flex flex-col h-screen bg-[#FFF] dark:bg-[#222]">
        <Head>
          <title>myChattanooga</title>
          <meta
            name="description"
            content="A community hub for the Chattanooga region. Stay up-to-date with the latest local articles and content"
            key="siteDescription"
          />
          <link rel="icon" href="/myChattanooga_small-icon.png" />
          {process.env.DEPLOYMENT_ENV === "prod" && <script
            async
            defer
            data-domain="mychattanooga.app"
            src="https://plausible.io/js/plausible.js"
          />}
        </Head>

        <header className="w-screen bg-[#FFF] dark:bg-[#222] overscroll-none sticky z-[99]">
          <StickyHeader
            menuExpanded={menuExpanded}
            isDark={isDark}
            toggleDarkMode={toggleDarkMode}
            currentWeatherLocation={currentWeatherLocation}
            setCurrentWeatherLocation={setCurrentWeatherLocation}
            panelExpanded={panelExpanded}
          />
          {/* TECH DEBT: Put motion element here instead of in MobileNav component */}
          <div className="sm:hidden absolute w-full h-fit object-center overscroll-none -left-full z-20 flex mx-auto"
            key="MobileNav"
          >
            <MobileNav
              isDark={isDark}
              menuExpanded={menuExpanded}
              setMenuExpanded={setMenuExpanded}
              toggleMobileUserPanel={toggleMobileUserPanel}
              panelExpanded={panelExpanded}
              currentWeatherLocation={currentWeatherLocation}
              setCurrentWeatherLocation={setCurrentWeatherLocation}
            />
          </div>
          <motion.div
            className="sm:hidden w-full h-fit object-center absolute z-10 mx-auto opacity-0 overscroll-contain"
            key="MobileUserPanel"
            animate={panelExpanded === true ? 'open' : 'closed'}
            transition={{
              duration: panelExpanded === true ? .3 : .3,
              type: "tween"
            }}
            variants={userPanelVariants}
          >
            <MobileUserPanel
              isDark={isDark}
              panelExpanded={panelExpanded}
              toggleDarkMode={toggleDarkMode}
              setAuxPanelExpanded={setAuxPanelExpanded}
              auxPanelExpanded={auxPanelExpanded}
              filterApplied={filterApplied}
              setFilterApplied={setFilterApplied}
              previousFilter={previousFilter}
              setPreviousFilter={setPreviousFilter}
              filterOptions={filterOptions}
              setFilterOptions={setFilterOptions}
              pageContent={pageContent}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              currentAuxSection={currentAuxSection}
              setCurrentAuxSection={setCurrentAuxSection}
              toggleMobileNav={toggleMobileNav}
              toggleMobileUserPanel={toggleMobileUserPanel}
              menuExpanded={menuExpanded}
              showFilters={showFilters}
            />
          </motion.div>
        </header>

        <main
          key="siteContent"
          className="w-screen h-screen align-center relative overflow-y-scroll overscroll-none"
          id="content"
        >
          <div className={childrenWrapperClassString}>
            <motion.div
              animate={panelExpanded === true ? 'extended' : 'normal'}
              className="flex justify-center scroll-smooth p-2 py-4 lg:px-0 lg:pt-8 flex w-screen"
              transition={{
                duration: panelExpanded === true ? .3 : .5,
                type: "tween"
              }}
              variants={childrenComponentVariants}
            >
              <div className="hidden relative flex-col md:block w-1/3 xl:w-1/5 w-full h-fit border-r-2 sticky top-4 pr-2">
                <UserPanel
                  isDark={isDark}
                  panelExpanded={panelExpanded}
                  toggleDarkMode={toggleDarkMode}
                  setAuxPanelExpanded={setAuxPanelExpanded}
                  auxPanelExpanded={auxPanelExpanded}
                  filterApplied={filterApplied}
                  setFilterApplied={setFilterApplied}
                  previousFilter={previousFilter}
                  setPreviousFilter={setPreviousFilter}
                  filterOptions={filterOptions}
                  setFilterOptions={setFilterOptions}
                  pageContent={pageContent}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  currentAuxSection={currentAuxSection}
                  setCurrentAuxSection={setCurrentAuxSection}
                  showFilters={showFilters}
                />
              </div>
              <div className="w-full md:w-10/12">
                {cloneElement(children, {
                  filterApplied: filterApplied,
                  pageContent: pageContent,
                  setPageContent: setPageContent,
                  currentPage: currentPage,
                  setCurrentPage: setCurrentPage,
                  contentLoading: contentLoading,
                  setContentLoading: setContentLoading
                })}
              </div>
              {/* {children} */}
            </motion.div>
          </div>
          <div className="lg:hidden h-16 w-screen">

          </div>

        </main>
        <motion.button
          aria-label="Go To Top Button"
          className="rounded-full w-10 h-10 bg-[#222] dark:bg-[#fff] fixed bottom-8 right-8 flex items-center opacity-0"
          onClick={scrollToTop}
          animate={showTopButton === true ? "visible" : "notVisible"}
          variants={scrollTopButtonVariants}
          whileTap={{ scale: .85 }}
        >
          <FontAwesomeIcon icon={faChevronUp} height={20} width={20} className="mx-auto" color={isDark === true ? "#222" : "#FFF"} />
        </motion.button>
        {/* <scrollToTop /> */}
        {/* <footer className="flex items-center w-screen">
          
          <div className="flex-auto">
            Hi
          </div>
            
        </footer> */}
      </div>

    </MyChattanoogaContext.Provider>
  )
}

export default MyChattanoogaContext
