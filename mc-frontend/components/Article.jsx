import Image from "next/image"
import Link from "next/link"

export const Article = () => {
    return (
    <div className="relative h-[110] w-full flex-auto bg-yellow-200">
        <Link href="/" >
            <a>
            <div className="p-4">
                <Image
                    src="https://soldierfield.net/sites/default/files/styles/large/public/2021-05/Chicago%20Bears%20Logo%20Square_1-2_11.jpg?itok=5Vs9TTVK"
                    height={1} // This will have to be tinkered with
                    width={1}
                    layout="responsive"
                />
                <div className="pt-4 flex-col items-center">
                    <div className="">
                        Publisher
                    </div>
                    <div className="pt-2">
                        Headline
                    </div>
                    <div className="pt-2">
                        Time since posted
                    </div>
                </div>
            </div>
            </a>
        </Link>
    </div>)
}