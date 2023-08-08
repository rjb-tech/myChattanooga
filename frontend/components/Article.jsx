import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { formatISO } from "date-fns";

import Chattanooganlogo from "../public/Chattanoogan.webp";
import ChronicleLogo from "../public/ChattNewsChronicle.png";
import Local3Logo from "../public/Local3.jpeg";
import PulseLogo from "../public/Pulse.png";
import FoxChattanoogaLogo from "../public/FoxChattanoogaLogo.jpg";
import TFPLogo from "../public/TimesFreePress.jpg";
import WDEFLogo from "../public/WDEF.png";

const accentColor = "#F39887";

// The spacing of these is tech debt
const publisherImageMappings = {
  Chattanoogan: Chattanooganlogo,
  ChattanoogaNewsChronicle: ChronicleLogo,
  Local3News: Local3Logo,
  ChattanoogaPulse: PulseLogo,
  FoxChattanooga: FoxChattanoogaLogo,
  TimesFreePress: TFPLogo,
  WDEF: WDEFLogo,
};

const publisherNameMappings = {
  Chattanoogan: "Chattanoogan",
  ChattanoogaNewsChronicle: "Chattanooga News Chronicle",
  Local3News: "Local 3 News",
  ChattanoogaPulse: "Chattanooga Pulse",
  FoxChattanooga: "Fox Chattanooga",
  TimesFreePress: "Chattanooga Times Free Press",
  WDEF: "WDEF News 12",
};

export const Article = ({ publisher, headline, timePosted, image, link }) => {
  const { currentDate } = useSelector((state) => state.main);
  const todayISO = formatISO(new Date(), { representation: "date" });
  const isToday = currentDate === todayISO;
  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      className="relative flex-auto h-fit md:h-full md:w-full lg:w-full shadow-sm bg-[#f0f0f0] dark:bg-[#1f1f1f] rounded-sm shadow-md rounded-lg"
    >
      <Link href={link}>
        <a target="_blank">
          <div className="p-4">
            <div className="">
              <Image
                className="rounded-md"
                src={publisherImageMappings[publisher]}
                height={10} // This will have to be tinkered with, probs needs a ternary operator thingy
                width={16}
                layout="responsive"
                alt={headline}
              />
            </div>
            <div className="pt-4 flex-col items-center">
              <p className="text-xs font-bold text-[#222] dark:text-[#F39887]">
                &copy; {publisherNameMappings[publisher].toUpperCase()}
              </p>
              <p className="pt-4 text-xl text-[#333] dark:text-[#f0f0f0]">
                {headline}
              </p>
              {/* <p className="pt-4 text-md italic text-[#F39887] dark:text-[#BBB]">
                {isToday && calculateTimeSincePosted(timePosted)}
              </p> */}
              <p className="hidden">{timePosted}</p>
            </div>
          </div>
        </a>
      </Link>
    </motion.div>
  );
};
