import Link from "next/link";
import { Socials } from "./Socials";
import { motion } from "framer-motion";
import { toggleMobileUserPanel } from "./helpers";
import { WeatherStation } from "./WeatherStation";
import { useSelector, useDispatch } from "react-redux";
import { setMobileNavExpanded } from "../redux/mainSlice";

const variants = {
  open: { opacity: 1, x: "98.8%" },
  closed: { opacity: 0, x: "-5%" },
};

export const MobileNav = () => {
  const dispatch = useDispatch();
  const {
    mobileNavExpanded,
    panelExpanded,
    auxPanelExpanded,
    weatherLocation,
    isDark,
  } = useSelector((state) => state.main);
  return (
    <motion.nav
      className="items-center w-full shadow-lg mx-auto bg-[#f0f0f0] text-[#222] dark:bg-[#222] dark:text-[#f0f0f0] rounded-b-xl overscroll-none"
      animate={mobileNavExpanded ? "open" : "closed"}
      transition={{ duration: 0.3, type: "tween" }}
      variants={variants}
    >
      <div className="h-fit w-full divide-y-2 flex-col flex-auto text-center">
        <div className="h-fit mx-auto py-6">
          <WeatherStation
            isDark={isDark}
            currentWeatherLocation={weatherLocation}
          />
          <Socials />
        </div>
        <div className="h-12 w-full p-1 flex items-center">
          <Link href="/">
            <a>
              <button
                className="w-screen h-5/6"
                onClick={() => {
                  dispatch(setMobileNavExpanded(false));
                  if (panelExpanded === true) {
                    toggleMobileUserPanel(
                      dispatch,
                      auxPanelExpanded,
                      panelExpanded
                    );
                  }
                }}
              >
                News
              </button>
            </a>
          </Link>
        </div>
        <div className="h-12 w-full p-1 flex items-center">
          <Link href="/stats">
            <a>
              <button
                className="w-screen h-5/6"
                onClick={() => {
                  dispatch(setMobileNavExpanded(false));
                  if (panelExpanded === true) {
                    toggleMobileUserPanel(
                      dispatch,
                      auxPanelExpanded,
                      panelExpanded
                    );
                  }
                }}
              >
                Stats
              </button>
            </a>
          </Link>
        </div>
        <div className="h-12 w-full p-1 flex items-center">
          <Link href="/faq">
            <a>
              <button
                className="w-screen h-5/6"
                onClick={() => {
                  dispatch(setMobileNavExpanded(false));
                  if (panelExpanded === true) {
                    toggleMobileUserPanel(
                      dispatch,
                      auxPanelExpanded,
                      panelExpanded
                    );
                  }
                }}
              >
                FAQ
              </button>
            </a>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
};
