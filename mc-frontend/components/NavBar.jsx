import Link from "next/link"

export const NavBar = () => {
    return (
        <div className="flex justify-around w-full h-12 content-center items-center">
            <div className="text-center content-center items-center">
                <Link href='/'>
                    <a className='text-center'>
                        Brews
                    </a>
                </Link>
            </div>
            <div className="text-center content-center items-center">
                <Link href='/'>
                    <a className='text-center'>
                        News
                    </a>
                </Link>
            </div>
            <div className="text-center content-center items-center">
                <Link href='/'>
                    <a className='text-center'>
                        FAQ
                    </a>
                </Link>
            </div>
        </div>
    )
}