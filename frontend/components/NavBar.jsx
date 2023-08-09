import Link from "next/link";
import { useSelector } from "react-redux";

export const NavBar = () => {
  const { pageContent } = useSelector((state) => state.main);
  return (
    <div className="flex shadow justify-around w-full h-12 content-center items-center bg-[#f0f0f0] text-[#222] dark:bg-[#222] dark:text-[#f0f0f0]">
      <div className="text-center content-center items-center">
        <Link href="/">
          <a className="text-center">News</a>
        </Link>
      </div>
      <div className="text-center content-center items-center">
        <Link href="/faq">
          <a className="text-center">FAQ</a>
        </Link>
      </div>
      <div className="text-center content-center items-center">
        <Link href="https://www.buymeacoffee.com/mychattanooga">
          <a className="text-center" target="_blank">
            Support Us
          </a>
        </Link>
      </div>
    </div>
  );
};
