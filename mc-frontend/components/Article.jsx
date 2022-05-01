import Image from "next/image"
import Link from "next/link"
import { calculateTimeSincePosted } from "./helpers"
import { motion } from "framer-motion"

export const Article = ({ publisher, headline, timePosted, image, link }) => {
    return (
    <motion.div whileTap={{ scale: 0.95 }} className="relative flex-auto h-fit md:h-full md:w-full lg:w-full shadow-sm bg-[#fff] dark:bg-[#1f1f1f] rounded-sm shadow-md rounded-lg">
        <Link href={link} >
            <a target="_blank">
                <div className="p-4">
                    <div className="">
                        <Image
                            className="rounded-md"
                            src={image}
                            height={10} // This will have to be tinkered with, probs needs a ternary operator thingy
                            width={16}
                            layout="responsive"
                        />
                    </div>
                    <div className="pt-4 flex-col items-center">
                        <p className="text-xs font-bold text-[#222] dark:text-[#F7BCB1]">
                            &copy; {publisher.toUpperCase()}
                        </p>
                        <p className="pt-2 text-xl text-[#333] dark:text-[#FFF]">
                            {headline}
                        </p>
                        <p className="pt-2 text-md italic text-[#F7BCB1] dark:text-[#BBB]">
                            {calculateTimeSincePosted(timePosted)}
                        </p>
                        <p className="hidden">
                            {timePosted}
                        </p>
                    </div>
                </div>
            </a>
        </Link>
    </motion.div>)
}