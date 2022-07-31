import Image from "next/image"
import Link from "next/link"
import { calculateTimeSincePosted } from "./helpers"
import { motion } from "framer-motion"
const accentColor = '#F39887'

export const BrewsRelease = ({ publisher, headline, datePosted, image }) => {
  return (
    <div className="relative flex-auto h-fit md:h-full md:w-full lg:w-full shadow-sm bg-[#fff] dark:bg-[#1f1f1f] rounded-sm shadow-md rounded-lg">
      <div className="p-4">
        <div className="">
          {image && <Image
            className="rounded-md"
            src={image}
            height={10} // This will have to be tinkered with, probs needs a ternary operator thingy
            width={16}
            layout="responsive"
            alt={headline}
          />}
        </div>
        <div className="pt-4 flex-col items-center">
          <p className="text-xs font-bold text-[#222] dark:text-[#F39887]">
            &copy; {publisher.toUpperCase()}
          </p>
          <p className="pt-2 text-xl text-[#333] dark:text-[#FFF]">
            {headline}
          </p>
          <p className="pt-2 text-md italic text-[#F39887] dark:text-[#BBB]">
            Posted on {new Date(datePosted).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>)
}