import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { toggleMobileNav } from "../redux/mainSlice";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const LeftPanel = ({ isDark }) => {
  const dispatch = useDispatch();
  const iconColor = isDark === true ? "#f0f0f0" : "#222";
  return (
    <div className="flex w-1/4 md:w-1/12 flex-auto h-full relative z-[100]">
      <motion.button
        aria-label="Mobile Navigation Menu"
        whileTap={{ scale: 0.8 }}
        className="sm:hidden flex-auto pt-3"
        type="button"
        onClick={() => dispatch(toggleMobileNav())}
      >
        <div className="p-6 xs:p-8">
          {/* Put isDark trigger in the LeftPanel props and hook up to system os setting */}
          <FontAwesomeIcon icon={faBars} style={{ color: `${iconColor}` }} />
        </div>
      </motion.button>
      <div className="hidden md:block w-full bg-[#f0f0f0] text-[#222] dark:bg-[#222] dark:text-[#f0f0f0]"></div>
    </div>
  );
};
