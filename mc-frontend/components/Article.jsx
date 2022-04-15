import Image from "next/image"
import Link from "next/link"

export const Article = () => {
    return (
    <div className="relative flex-auto h-fit md:w-full lg:w-full shadow-sm hover:bg-slate-100 rounded-sm shadow-md">
        <Link href="/" >
            <a>
                <div className="p-4">
                    <div className="">
                        <Image
                            className="rounded-md"
                            src="https://soldierfield.net/sites/default/files/styles/large/public/2021-05/Chicago%20Bears%20Logo%20Square_1-2_11.jpg?itok=5Vs9TTVK"
                            height={1} // This will have to be tinkered with
                            width={1}
                            layout="responsive"
                        />
                    </div>
                    <div className="pt-4 flex-col items-center">
                        <div className="text-xl">
                            Publisher
                        </div>
                        <div className="pt-2 text-2xl">
                            Headline
                        </div>
                        <div className="pt-2 text-xl">
                            Time since posted
                        </div>
                    </div>
                </div>
            </a>
        </Link>
    </div>)
}