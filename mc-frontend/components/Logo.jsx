import Link from "next/link";
import Image from "next/image";
import { toggleMobileUserPanel } from "./helpers";
import { useDispatch, useSelector } from "react-redux";
import logo from "../public/myChattanooga_long-dark.png";
import logo_dark from "../public/myChattanooga_long-light.png";

export const Logo = ({ isDark }) => {
  const dispatch = useDispatch();
  const { panelExpanded, auxPanelExpanded } = useSelector(
    (state) => state.main
  );
  const dynamicLogo = isDark === true ? logo_dark : logo;
  return (
    <div
      className="w-2/3 sm:w-2/6 xl:w-1/5 relative z-[100]"
      onClick={() => {
        if (panelExpanded === true) {
          toggleMobileUserPanel(dispatch, auxPanelExpanded, panelExpanded);
        }
      }}
    >
      <Link href="/">
        <a>
          <Image
            src={dynamicLogo}
            layout="responsive"
            priority
            alt="myChattanooga Logo"
          />
        </a>
      </Link>
    </div>
  );
};
