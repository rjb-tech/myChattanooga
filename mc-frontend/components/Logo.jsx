import Image from "next/image";
import logo from "../public/myChattanooga_long-dark.png";
import logo_dark from "../public/myChattanooga_long-light.png";
import Link from "next/link";
import { toggleMobileUserPanel } from "../redux/mainSlice";
import { useDispatch } from "react-redux";

export const Logo = ({ isDark, panelExpanded }) => {
  const dispatch = useDispatch();
  const dynamicLogo = isDark === true ? logo_dark : logo;
  return (
    <div
      className="w-2/3 sm:w-2/6 xl:w-1/5 relative z-[100]"
      onClick={() => {
        if (panelExpanded === true) {
          dispatch(toggleMobileUserPanel());
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
