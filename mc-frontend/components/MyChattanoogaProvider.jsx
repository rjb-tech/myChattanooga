import Head from "next/head";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { MobileNav } from "./MobileNav";
import { UserPanel } from "./UserPanel";
import { useState, useEffect } from "react";
import { StickyHeader } from "./StickyHeader";
import { MobileUserPanel } from "./MobileUserPanel";
import { useDispatch, useSelector } from "react-redux";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  setFilterApplied,
  setFilterOptions,
  setIsDark,
} from "../redux/mainSlice";

const childrenComponentVariants = {
  normal: { y: "0%" },
  extended: { y: "5rem" },
};

const userPanelVariants = {
  open: { opacity: 1, y: "0%" },
  closed: { opacity: 0, y: "-100%" },
};

const scrollTopButtonVariants = {
  visible: { opacity: 0.7 },
  closed: { opacity: 0 },
};

export const MyChattanoogaProvider = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { mobileNavExpanded, panelExpanded, pageContent, isDark } = useSelector(
    (state) => state.main
  );

  const [showTopButton, setShowTopButton] = useState(false);
  const showFilters = router.pathname === "/" && pageContent.length > 0;

  useEffect(() => {
    // Scroll window to top on page change
    const element = document.getElementById("content");
    element.scrollTop = 0;
    dispatch(setFilterApplied("all"));
  }, [router.pathname]);

  useEffect(() => {
    const publishers = [
      ...new Set(pageContent.map((contentItem) => contentItem?.publisher)),
    ].sort();
    dispatch(setFilterOptions(publishers));
  }, [pageContent]);

  useEffect(() => {
    // Set dark mode
    const isDarkMode =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    dispatch(setIsDark(isDarkMode));

    // https://www.kindacode.com/article/how-to-create-a-scroll-to-top-button-in-react/
    const element = document.getElementById("content");
    const handleScroll = () => {
      const element = document.getElementById("content");
      if (element.scrollTop > 200) {
        setShowTopButton(true);
      } else {
        setShowTopButton(false);
      }
    };
    element.addEventListener("scroll", handleScroll);

    // This may not be needed, but just in case :)
    return () => {
      removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    const element = document.getElementById("content");
    element.scrollTo({
      top: 0,
      behavior: "smooth", // for smoothly scrolling
    });
  };

  const childrenWrapperClassString =
    mobileNavExpanded === true
      ? "overscroll-contain transition duration-[300ms] relative blur-sm ease-linear "
      : "overscroll-contain transition duration-[300ms] relative";

  return (
    <>
      <div className="flex flex-col h-screen bg-[#f0f0f0] dark:bg-[#222]">
        <Head>
          <title>myChattanooga</title>
          <meta
            name="description"
            content="A community hub for the Chattanooga region. Stay up-to-date with the latest local articles and content"
            key="siteDescription"
          />
          <link rel="icon" href="/myChattanooga_small-icon.png" />
          {process.env.DEPLOYMENT_ENV === "prod" && (
            <script
              async
              defer
              data-domain="mychattanooga.app"
              src="https://plausible.io/js/plausible.js"
            />
          )}
        </Head>

        <header className="w-screen bg-[#f0f0f0] dark:bg-[#222] overscroll-none sticky z-[99]">
          <StickyHeader />
          {/* TECH DEBT: Put motion element here instead of in MobileNav component */}
          <div
            className="sm:hidden absolute w-full h-fit object-center overscroll-none -left-full z-20 flex mx-auto"
            key="MobileNav"
          >
            <MobileNav />
          </div>
          <motion.div
            className="sm:hidden w-full h-fit object-center absolute z-10 mx-auto opacity-0 overscroll-contain"
            key="MobileUserPanel"
            animate={panelExpanded === true ? "open" : "closed"}
            transition={{
              duration: panelExpanded === true ? 0.3 : 0.3,
              type: "tween",
            }}
            variants={userPanelVariants}
          >
            <MobileUserPanel showFilters={showFilters} />
          </motion.div>
        </header>

        <main
          key="siteContent"
          className="w-screen h-screen align-center relative overflow-y-scroll overscroll-none"
          id="content"
        >
          <div className={childrenWrapperClassString}>
            <motion.div
              animate={panelExpanded === true ? "extended" : "normal"}
              className="flex justify-center scroll-smooth p-2 py-4 lg:px-0 lg:pt-8 flex w-screen"
              transition={{
                duration: panelExpanded === true ? 0.3 : 0.5,
                type: "tween",
              }}
              variants={childrenComponentVariants}
            >
              <div className="hidden relative flex-col md:block w-1/3 xl:w-1/5 w-full h-fit border-r-2 sticky top-4 pr-2">
                <UserPanel showFilters={showFilters} />
              </div>
              <div className="w-full md:w-10/12">{children}</div>
            </motion.div>
          </div>
          <div className="lg:hidden h-16 w-screen"></div>
        </main>
        <motion.button
          aria-label="Go To Top Button"
          className="rounded-full w-10 h-10 bg-[#222] dark:bg-[#f0f0f0] fixed bottom-8 right-8 flex items-center opacity-0"
          onClick={scrollToTop}
          animate={showTopButton === true ? "visible" : "notVisible"}
          variants={scrollTopButtonVariants}
          whileTap={{ scale: 0.85 }}
        >
          <FontAwesomeIcon
            icon={faChevronUp}
            height={20}
            width={20}
            className="mx-auto"
            color={isDark === true ? "#222" : "#f0f0f0"}
          />
        </motion.button>
      </div>
    </>
  );
};
