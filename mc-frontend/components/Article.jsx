import Image from "next/image"
import Link from "next/link"

export const Article = ({ publisher, headline, time_posted, image }) => {
    return (
    <div className="relative flex-auto h-fit md:h-full md:w-full lg:w-full shadow-sm bg-white hover:bg-slate-100 rounded-sm shadow-md">
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
                        <div className="text-xl">
                            {publisher}
                        </div>
                        <div className="pt-2 text-2xl">
                            {headline}
                        </div>
                        <div className="pt-2 text-xl">
                            {time_posted}
                        </div>
                    </div>
                </div>
            </a>
        </Link>
    </div>)
}