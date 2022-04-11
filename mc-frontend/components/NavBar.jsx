import Link from 'next/link'

export const NavBar = (props) => {
    return (
        <div className='flex w-fit'>
            <nav className='flex flex-wrap items-center flex-nowrap flex-auto justify-items-end w-fit'>  
                <Link href='/'>
                    <a>
                        News
                    </a>
                </Link>
            </nav>
        </div>  
    );
};