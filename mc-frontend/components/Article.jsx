import Image from "next/image"
import Link from "next/link"
import { calculateTimeSincePosted } from "./helpers"

const publisherBaseString = "text-xs font-bold"
const headlineBaseString = "pt-2 text-xl"

export const Article = ({ publisher, headline, timePosted, image, isDark }) => {
    const publisherClassString = isDark 
                                ? publisherBaseString + " text-[#F39887]" 
                                : publisherBaseString
    const headlineClassString = isDark 
                                ? headlineBaseString + " text-white" 
                                : headlineBaseString
    const timeClassString = isDark 
                            ? "pt-2 text-md italic text-stone-600" 
                            : "pt-2 text-md italic text-[#F39887]"
    const articleWrapperString = isDark 
                                 ? "relative flex-auto h-fit md:h-full md:w-full lg:w-full shadow-sm bg-black hover:bg-slate-100 rounded-sm shadow-md" 
                                 : "relative flex-auto h-fit md:h-full md:w-full lg:w-full shadow-sm bg-white hover:bg-slate-100 rounded-sm shadow-md"
    return (
    <div className={articleWrapperString}>
        <Link href="/" >
            <a>
                <div className="p-4">
                    <div className="">
                        <Image
                            className="rounded-md"
                            src={image}
                            height={12} // This will have to be tinkered with, probs needs a ternary operator thingy
                            width={16}
                            layout="responsive"
                        />
                    </div>
                    <div className="pt-4 flex-col items-center">
                        <p className={publisherClassString}>
                            &copy; {publisher.toUpperCase()}
                        </p>
                        <p className={headlineClassString}>
                            {headline}
                        </p>
                        <p className="pt-2 text-md italic text-[#F39887]">
                            {calculateTimeSincePosted(timePosted)}
                        </p>
                        <p className="hidden">
                            {timePosted}
                        </p>
                    </div>
                </div>
            </a>
        </Link>
    </div>)
}